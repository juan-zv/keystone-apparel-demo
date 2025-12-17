import * as React from "react"
import { useMemo, useCallback } from "react"
import { ThemeProvider } from "@/components/theme-provider"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SelectGroup } from "@radix-ui/react-select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import db from "@/lib/database"
import type { Route } from "./+types/sales-register"
import { NavHeader } from "@/components/nav-header"
import { productTypes, colors, designs, sizes, transactionTypes, SELLERS, cogs } from "@/lib/product-data"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register Sale - Keystone Apparel" },
        { name: "description", content: "Register new sales transactions for Keystone Apparel" },
    ]
}

const formSchema = z.object({
    date: z.date(),
    productType: z.string().min(1, { message: "Please select a product type." }),
    color: z.string().optional(),
    design: z.string().min(1, { message: "Please select a design." }),
    size: z.string().optional(),
    price: z.number(),
    cogs: z.number(),
    transactionType: z.string().min(1, { message: "Please select a transaction type." }),
    seller: z.string().optional(),
    notes: z.string().optional(),
}).refine(data => {
    // For non-sticker products, color and size are required
    if (data.productType !== "sticker") {
        return data.color && data.color.length > 0 && data.size && data.size.length > 0
    }
    return true
}, {
    message: "Color and size are required for t-shirts and hoodies",
    path: ["color"]
})

const presaleFormSchema = z.object({
    created_at: z.date(),
    productType: z.string().min(1, { message: "Please select a product type." }),
    color: z.string().optional(),
    design: z.string().min(1, { message: "Please select a design." }),
    size: z.string().optional(),
    price: z.number(),
    cogs: z.number(),
    transactionType: z.string().min(1, { message: "Please select a transaction type." }),
    seller: z.string().optional(),
    notes: z.string().optional(),
}).refine(data => {
    // For non-sticker products, color and size are required
    if (data.productType !== "sticker") {
        return data.color && data.color.length > 0 && data.size && data.size.length > 0
    }
    return true
}, {
    message: "Color and size are required for t-shirts and hoodies",
    path: ["color"]
})

export default function SalesRegister({ params }: Route.ComponentProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [formData, setFormData] = React.useState<z.infer<typeof formSchema> | null>(null)

    // Presale states
    const [isPresaleDialogOpen, setIsPresaleDialogOpen] = React.useState(false)
    const [isPresaleSuccessDialogOpen, setIsPresaleSuccessDialogOpen] = React.useState(false)
    const [isPresaleSubmitting, setIsPresaleSubmitting] = React.useState(false)
    const [presaleFormData, setPresaleFormData] = React.useState<z.infer<typeof presaleFormSchema> | null>(null)

    // Monkey backflip dialog and secret feature
    const [isMonkeyDialogOpen, setIsMonkeyDialogOpen] = React.useState(false)
    const [secretFeatureEnabled, setSecretFeatureEnabled] = React.useState(false)

    // Discount checkbox states
    const [applyDiscount, setApplyDiscount] = React.useState(false)
    const [applyLargeDiscount, setApplyLargeDiscount] = React.useState(false)
    const [apply30PercentOff, setApply30PercentOff] = React.useState(false)
    const [applyTenOffTshirts, setApplyTenOffTshirts] = React.useState(false)
    const [apply50PercentOffHoodie, setApply50PercentOffHoodie] = React.useState(false)
    const [applyPresaleDiscount, setApplyPresaleDiscount] = React.useState(false)
    const [applyPresaleLargeDiscount, setApplyPresaleLargeDiscount] = React.useState(false)
    const [applyPresale30PercentOff, setApplyPresale30PercentOff] = React.useState(false)
    const [applyPresaleTenOffTshirts, setApplyPresaleTenOffTshirts] = React.useState(false)
    const [applyPresale50PercentOffHoodie, setApplyPresale50PercentOffHoodie] = React.useState(false)

    // Multi-item sale states
    const [twoTshirtsEnabled, setTwoTshirtsEnabled] = React.useState(false)
    const [twoTshirts24Enabled, setTwoTshirts24Enabled] = React.useState(false)
    const [bogoEnabled, setBogoEnabled] = React.useState(false)

    // Multi-item presale states
    const [presaleTwoTshirtsEnabled, setPresaleTwoTshirtsEnabled] = React.useState(false)
    const [presaleTwoTshirts24Enabled, setPresaleTwoTshirts24Enabled] = React.useState(false)
    const [presaleBogoEnabled, setPresaleBogoEnabled] = React.useState(false)

    // Second item fields (for 2 T-shirts or BOGO)
    const [secondColor, setSecondColor] = React.useState("")
    const [secondDesign, setSecondDesign] = React.useState("")
    const [secondSize, setSecondSize] = React.useState("")

    // Second item fields for presale
    const [presaleSecondColor, setPresaleSecondColor] = React.useState("")
    const [presaleSecondDesign, setPresaleSecondDesign] = React.useState("")
    const [presaleSecondSize, setPresaleSecondSize] = React.useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            productType: "",
            color: "",
            design: "",
            size: "",
            price: 0,
            cogs: 0,
            transactionType: "",
            seller: "",
            notes: "",
        },
    })

    const presaleForm = useForm<z.infer<typeof presaleFormSchema>>({
        resolver: zodResolver(presaleFormSchema),
        defaultValues: {
            created_at: new Date(),
            productType: "",
            color: "",
            design: "",
            size: "",
            price: 0,
            cogs: 0,
            transactionType: "",
            seller: "",
            notes: "",
        },
    })

    const productType = form.watch("productType")
    const transactionType = form.watch("transactionType")
    const design = form.watch("design")
    const size = form.watch("size")

    const presaleProductType = presaleForm.watch("productType")
    const presaleTransactionType = presaleForm.watch("transactionType")
    const presaleDesign = presaleForm.watch("design")
    const presaleSize = presaleForm.watch("size")

    // Helper to get available designs based on product type
    const getAvailableDesigns = (productType: string) => {
        if (productType === "sticker") {
            // Only certain designs are available for stickers
            return designs.filter(d => ["endure-to-the-end", "doubt-not"].includes(d.value))
        }
        return designs
    }

    // Memoize COGS lookup for main form
    const currentCOGS = useMemo(() => {
        if (productType === "sticker" && design) {
            // For stickers, size is always "one-size"
            const cogsEntry = cogs.find(
                c => c.type === productType && c.design === design && c.size === "one-size"
            )
            return cogsEntry?.cogs || 0
        } else if (productType && design && size) {
            const cogsEntry = cogs.find(
                c => c.type === productType && c.design === design && c.size === size
            )
            return cogsEntry?.cogs || 0
        }
        return 0
    }, [productType, design, size])

    // Memoize price calculation for main form
    const calculatedPrice = useMemo(() => {
        // Stickers have fixed price
        if (productType === "sticker" && transactionType) {
            return 2.36
        }

        // $10 off t-shirts (sets price directly to $14.99)
        if (applyTenOffTshirts && productType === "tshirt" && transactionType) {
            return 14.99
        }

        // Check for 30% off discount (overrides other discounts)
        if (apply30PercentOff && productType === "tshirt" && transactionType) {
            return 17.50
        }
        if (apply30PercentOff && productType === "hoodie" && transactionType) {
            return 34.99
        }

        // Check for 50% off hoodie discount (overrides other discounts)
        if (apply50PercentOffHoodie && productType === "hoodie" && transactionType) {
            return 24.99
        }

        const checkboxDiscount = applyDiscount ? 2.00 : 0.00
        const largeDiscount = applyLargeDiscount ? 15.00 : 0.00
        const totalDiscount = checkboxDiscount + largeDiscount

        // Handle special pricing for multi-item sales
        if (twoTshirtsEnabled) {
            return 34.99 - totalDiscount
        } else if (twoTshirts24Enabled) {
            return 24.99 - totalDiscount
        } else if (bogoEnabled && productType === "hoodie") {
            return 49.99 - totalDiscount
        } else if (productType === "tshirt" && transactionType) {
            return 9.99 - totalDiscount
        } else if (productType === "hoodie" && transactionType) {
            return 49.99 - totalDiscount
        }
        return 0.00
    }, [productType, transactionType, applyDiscount, applyLargeDiscount, apply30PercentOff, applyTenOffTshirts, apply50PercentOffHoodie, twoTshirtsEnabled, twoTshirts24Enabled, bogoEnabled])

    React.useEffect(() => {
        form.setValue("price", calculatedPrice)
        form.setValue("cogs", currentCOGS)
    }, [calculatedPrice, currentCOGS, form])

    // Memoize COGS lookup for presale form
    const presaleCOGS = useMemo(() => {
        if (presaleProductType === "sticker" && presaleDesign) {
            // For stickers, size is always "one-size"
            const cogsEntry = cogs.find(
                c => c.type === presaleProductType && c.design === presaleDesign && c.size === "one-size"
            )
            return cogsEntry?.cogs || 0
        } else if (presaleProductType && presaleDesign && presaleSize) {
            const cogsEntry = cogs.find(
                c => c.type === presaleProductType && c.design === presaleDesign && c.size === presaleSize
            )
            return cogsEntry?.cogs || 0
        }
        return 0
    }, [presaleProductType, presaleDesign, presaleSize])

    // Memoize price calculation for presale form
    const calculatedPresalePrice = useMemo(() => {
        // Stickers have fixed price
        if (presaleProductType === "sticker" && presaleTransactionType) {
            return 2.36
        }

            // $10 off t-shirts for presales (sets price directly to $14.99)
            if (applyPresaleTenOffTshirts && presaleProductType === "tshirt" && presaleTransactionType) {
                return 14.99
            }

        // Check for 30% off discount (overrides other discounts)
        if (applyPresale30PercentOff && presaleProductType === "tshirt" && presaleTransactionType) {
            return 17.50
        }
        if (applyPresale30PercentOff && presaleProductType === "hoodie" && presaleTransactionType) {
            return 34.99
        }

        // Check for 50% off hoodie discount (overrides other discounts)
        if (applyPresale50PercentOffHoodie && presaleProductType === "hoodie" && presaleTransactionType) {
            return 24.99
        }

        const checkboxDiscount = applyPresaleDiscount ? 2.00 : 0.00
        const largeDiscount = applyPresaleLargeDiscount ? 15.00 : 0.00
        const totalDiscount = checkboxDiscount + largeDiscount

        // Handle special pricing for multi-item presales
        if (presaleTwoTshirtsEnabled) {
            return 34.99 - totalDiscount
        } else if (presaleTwoTshirts24Enabled) {
            return 24.99 - totalDiscount
        } else if (presaleBogoEnabled && presaleProductType === "hoodie") {
            return 49.99 - totalDiscount
        } else if (presaleProductType === "tshirt" && presaleTransactionType) {
            return 9.99 - totalDiscount
        } else if (presaleProductType === "hoodie" && presaleTransactionType) {
            return 49.99 - totalDiscount
        }
        return 0.00
    }, [presaleProductType, presaleTransactionType, applyPresaleDiscount, applyPresaleLargeDiscount, applyPresale30PercentOff, applyPresaleTenOffTshirts, applyPresale50PercentOffHoodie, presaleTwoTshirtsEnabled, presaleTwoTshirts24Enabled, presaleBogoEnabled])

    React.useEffect(() => {
        presaleForm.setValue("price", calculatedPresalePrice)
        presaleForm.setValue("cogs", presaleCOGS)
    }, [calculatedPresalePrice, presaleCOGS, presaleForm])

    // Clear color and size when sticker is selected for main form
    React.useEffect(() => {
        if (productType === "sticker") {
            form.setValue("color", "")
            form.setValue("size", "")
            // Also clear design if current design is not available for stickers
            const availableDesigns = ["endure-to-the-end", "doubt-not"]
            if (design && !availableDesigns.includes(design)) {
                form.setValue("design", "")
            }
        }
    }, [productType, design, form])

    // Clear $10 off tshirts checkbox if product type changes away from tshirt
    React.useEffect(() => {
        if (productType !== "tshirt" && applyTenOffTshirts) {
            setApplyTenOffTshirts(false)
        }
    }, [productType, applyTenOffTshirts])

    // Clear color and size when sticker is selected for presale form
    React.useEffect(() => {
        if (presaleProductType === "sticker") {
            presaleForm.setValue("color", "")
            presaleForm.setValue("size", "")
            // Also clear design if current design is not available for stickers
            const availableDesigns = ["endure-to-the-end", "doubt-not"]
            if (presaleDesign && !availableDesigns.includes(presaleDesign)) {
                presaleForm.setValue("design", "")
            }
        }
    }, [presaleProductType, presaleDesign, presaleForm])

    // Clear presale $10 off tshirts checkbox if presale product type changes away from tshirt
    React.useEffect(() => {
        if (presaleProductType !== "tshirt" && applyPresaleTenOffTshirts) {
            setApplyPresaleTenOffTshirts(false)
        }
    }, [presaleProductType, applyPresaleTenOffTshirts])

    const confirmSubmit = useCallback(async () => {
        if (!formData) return

        setIsSubmitting(true)

        const { productType, transactionType, color, size, ...rest } = formData
        const baseSubmission = {
            ...rest,
            product_type: productType,
            payment_method: transactionType,
            // For stickers, set color and size to null if empty
            color: productType === "sticker" ? null : color,
            size: productType === "sticker" ? null : size,
            date: new Date().toISOString(),
        }

        console.log("Submitting sale:", baseSubmission)

        // Prepare array of submissions
        const submissions = [baseSubmission]

        // Handle 2 T-shirts case - first item is $34.99, second is $0
        if (twoTshirtsEnabled && secondColor && secondDesign && secondSize) {
            const secondCogsEntry = cogs.find(
                c => c.type === "tshirt" && c.design === secondDesign && c.size === secondSize
            )
            const secondSubmission = {
                ...baseSubmission,
                color: secondColor,
                design: secondDesign,
                size: secondSize,
                product_type: "tshirt",
                price: 0,
                cogs: secondCogsEntry?.cogs || 0,
            }
            submissions.push(secondSubmission)
        }

        // Handle 2 T-shirts $24.99 case - first item is $24.99, second is $0
        if (twoTshirts24Enabled && secondColor && secondDesign && secondSize) {
            const secondCogsEntry = cogs.find(
                c => c.type === "tshirt" && c.design === secondDesign && c.size === secondSize
            )
            const secondSubmission = {
                ...baseSubmission,
                color: secondColor,
                design: secondDesign,
                size: secondSize,
                product_type: "tshirt",
                price: 0,
                cogs: secondCogsEntry?.cogs || 0,
            }
            submissions.push(secondSubmission)
        }

        // Handle BOGO case - hoodie is $49.99, t-shirt is $0
        if (bogoEnabled && productType === "hoodie" && secondColor && secondDesign && secondSize) {
            const secondCogsEntry = cogs.find(
                c => c.type === "tshirt" && c.design === secondDesign && c.size === secondSize
            )
            const secondSubmission = {
                ...baseSubmission,
                color: secondColor,
                design: secondDesign,
                size: secondSize,
                product_type: "tshirt",
                price: 0,
                cogs: secondCogsEntry?.cogs || 0,
            }
            submissions.push(secondSubmission)
        }

        const { error } = await db.from("Sales").insert(submissions)

        setIsSubmitting(false)

        if (error) {
            console.error("Error inserting data:", error)
            alert("Failed to save sale. Check the console for details.")
            setIsDialogOpen(false)
        } else {
            console.log("Data inserted successfully.")
            setIsDialogOpen(false)
            // Show monkey dialog if secret feature is enabled, otherwise show success dialog
            if (secretFeatureEnabled) {
                setIsMonkeyDialogOpen(true)
            } else {
                setIsSuccessDialogOpen(true)
            }
            form.reset()
            // Reset second item fields
            setSecondColor("")
            setSecondDesign("")
            setSecondSize("")
            setTwoTshirtsEnabled(false)
            setTwoTshirts24Enabled(false)
            setBogoEnabled(false)
        }
        setFormData(null)
    }, [formData, twoTshirtsEnabled, secondColor, secondDesign, secondSize, bogoEnabled, secretFeatureEnabled, form])

    function handleFormSubmission(data: z.infer<typeof formSchema>) {
        // Validate second item fields if multi-item sale is enabled
        if (twoTshirtsEnabled || twoTshirts24Enabled || bogoEnabled) {
            if (!secondColor || !secondDesign || !secondSize) {
                alert("Please fill in all fields for the second item.")
                return
            }
        }

        setFormData(data)
        setIsDialogOpen(true)
    }

    const confirmPresaleSubmit = useCallback(async () => {
        if (!presaleFormData) return

        setIsPresaleSubmitting(true)

        const { productType, transactionType, color, size, ...rest } = presaleFormData
        const baseSubmission = {
            ...rest,
            product_type: productType,
            payment_method: transactionType,
            // For stickers, set color and size to null if empty
            color: productType === "sticker" ? null : color,
            size: productType === "sticker" ? null : size,
            created_at: new Date().toISOString(),
            sold: false,
        }

        console.log("Submitting presale:", baseSubmission)

        // Prepare array of submissions
        const submissions = [baseSubmission]

        // Handle 2 T-shirts case - first item is $34.99, second is $0
        if (presaleTwoTshirtsEnabled && presaleSecondColor && presaleSecondDesign && presaleSecondSize) {
            const secondCogsEntry = cogs.find(
                c => c.type === "tshirt" && c.design === presaleSecondDesign && c.size === presaleSecondSize
            )
            const secondSubmission = {
                ...baseSubmission,
                color: presaleSecondColor,
                design: presaleSecondDesign,
                size: presaleSecondSize,
                product_type: "tshirt",
                price: 0,
                cogs: secondCogsEntry?.cogs || 0,
            }
            submissions.push(secondSubmission)
        }

        // Handle 2 T-shirts $24.99 case - first item is $24.99, second is $0
        if (presaleTwoTshirts24Enabled && presaleSecondColor && presaleSecondDesign && presaleSecondSize) {
            const secondCogsEntry = cogs.find(
                c => c.type === "tshirt" && c.design === presaleSecondDesign && c.size === presaleSecondSize
            )
            const secondSubmission = {
                ...baseSubmission,
                color: presaleSecondColor,
                design: presaleSecondDesign,
                size: presaleSecondSize,
                product_type: "tshirt",
                price: 0,
                cogs: secondCogsEntry?.cogs || 0,
            }
            submissions.push(secondSubmission)
        }

        // Handle BOGO case - hoodie is $49.99, t-shirt is $0
        if (presaleBogoEnabled && productType === "hoodie" && presaleSecondColor && presaleSecondDesign && presaleSecondSize) {
            const secondCogsEntry = cogs.find(
                c => c.type === "tshirt" && c.design === presaleSecondDesign && c.size === presaleSecondSize
            )
            const secondSubmission = {
                ...baseSubmission,
                color: presaleSecondColor,
                design: presaleSecondDesign,
                size: presaleSecondSize,
                product_type: "tshirt",
                price: 0,
                cogs: secondCogsEntry?.cogs || 0,
            }
            submissions.push(secondSubmission)
        }

        const { error } = await db.from("presales").insert(submissions)

        setIsPresaleSubmitting(false)

        if (error) {
            console.error("Error inserting presale data:", error)
            alert("Failed to save presale. Check the console for details.")
            setIsPresaleDialogOpen(false)
        } else {
            console.log("Presale data inserted successfully.")
            setIsPresaleDialogOpen(false)
            // Show monkey dialog if secret feature is enabled, otherwise show success dialog
            if (secretFeatureEnabled) {
                setIsMonkeyDialogOpen(true)
            } else {
                setIsPresaleSuccessDialogOpen(true)
            }
            presaleForm.reset()
            // Reset presale second item fields
            setPresaleSecondColor("")
            setPresaleSecondDesign("")
            setPresaleSecondSize("")
            setPresaleTwoTshirtsEnabled(false)
            setPresaleTwoTshirts24Enabled(false)
            setPresaleBogoEnabled(false)
        }
        setPresaleFormData(null)
    }, [presaleFormData, presaleTwoTshirtsEnabled, presaleSecondColor, presaleSecondDesign, presaleSecondSize, presaleBogoEnabled, secretFeatureEnabled, presaleForm])

    function handlePresaleFormSubmission(data: z.infer<typeof presaleFormSchema>) {
        // Validate second item fields if multi-item presale is enabled
        if (presaleTwoTshirtsEnabled || presaleTwoTshirts24Enabled || presaleBogoEnabled) {
            if (!presaleSecondColor || !presaleSecondDesign || !presaleSecondSize) {
                alert("Please fill in all fields for the second item.")
                return
            }
        }

        setPresaleFormData(data)
        setIsPresaleDialogOpen(true)
    }

    return (
        <ThemeProvider defaultTheme="dark">
            <NavHeader />
            <h1 className="text-2xl font-bold text-center my-4">Sales Tracker - DEMO version</h1>

            <Card className="w-[90%] max-w-[500px] mx-auto my-4">
                <Collapsible>
                    <CardHeader>
                        <CollapsibleTrigger className="w-full">
                            <CardTitle className="text-lg font-semibold text-left">Record Presale 😟</CardTitle>
                        </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                        <CardHeader className="pt-0">
                            <CardDescription>
                                Please use this form to record presale transactions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="presale-form" onSubmit={presaleForm.handleSubmit(handlePresaleFormSubmission)}>
                                <FieldGroup>
                                    <Controller
                                        name="productType"
                                        control={presaleForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Type of Product Sold</FieldLabel>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a product type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {productTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="color"
                                        control={presaleForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Color</FieldLabel>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={presaleProductType === "sticker"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={presaleProductType === "sticker" ? "N/A for stickers" : "Select a color"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {colors.map((color) => (
                                                                <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="design"
                                        control={presaleForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Design</FieldLabel>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a design" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {getAvailableDesigns(presaleProductType).map((design) => (
                                                                <SelectItem key={design.value} value={design.value}>{design.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="size"
                                        control={presaleForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Size</FieldLabel>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    disabled={presaleProductType === "sticker"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={presaleProductType === "sticker" ? "N/A for stickers" : "Select a size"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {sizes.map((size) => (
                                                                <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="transactionType"
                                        control={presaleForm.control}
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Transaction Type</FieldLabel>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a transaction type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {transactionTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="seller"
                                        control={presaleForm.control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Seller (Optional)</FieldLabel>
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a seller" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {SELLERS.map((seller) => (
                                                                <SelectItem key={seller} value={seller}>{seller}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        )}
                                    />
                                    {/* Discount Checkboxes */}
                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="presale-discount"
                                            checked={applyPresaleDiscount}
                                            onCheckedChange={(checked) => setApplyPresaleDiscount(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="presale-discount"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            Apply $2 Discount
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="presale-large-discount"
                                            checked={applyPresaleLargeDiscount}
                                            onCheckedChange={(checked) => setApplyPresaleLargeDiscount(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="presale-large-discount"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            Apply $15 Discount
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="presale-30-percent-off"
                                            checked={applyPresale30PercentOff}
                                            onCheckedChange={(checked) => setApplyPresale30PercentOff(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="presale-30-percent-off"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            30% Off (T-shirt: $17.50, Hoodie: $34.99)
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="presale-10-off-tshirts"
                                            checked={applyPresaleTenOffTshirts}
                                            disabled={presaleProductType !== "tshirt"}
                                            onCheckedChange={(checked) => setApplyPresaleTenOffTshirts(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="presale-10-off-tshirts"
                                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${presaleProductType === "tshirt" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                        >
                                            $10 Off T-shirts ($14.99)
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="presale-50-percent-off-hoodie"
                                            checked={applyPresale50PercentOffHoodie}
                                            disabled={presaleProductType !== "hoodie"}
                                            onCheckedChange={(checked) => setApplyPresale50PercentOffHoodie(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="presale-50-percent-off-hoodie"
                                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${presaleProductType === "hoodie" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                        >
                                            50% Off Hoodie ($24.99)
                                        </Label>
                                    </div>

                                    {/* Multi-Item Presale Checkboxes */}
                                    <Separator className="my-2" />
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="presale-two-tshirts"
                                            checked={presaleTwoTshirtsEnabled}
                                            onCheckedChange={(checked) => {
                                                setPresaleTwoTshirtsEnabled(checked as boolean)
                                                if (checked) {
                                                    setPresaleTwoTshirts24Enabled(false)
                                                    setPresaleBogoEnabled(false)
                                                    presaleForm.setValue("productType", "tshirt")
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="presale-two-tshirts"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            2 T-Shirts x $34.99
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="presale-two-tshirts-24"
                                            checked={presaleTwoTshirts24Enabled}
                                            onCheckedChange={(checked) => {
                                                setPresaleTwoTshirts24Enabled(checked as boolean)
                                                if (checked) {
                                                    setPresaleTwoTshirtsEnabled(false)
                                                    setPresaleBogoEnabled(false)
                                                    presaleForm.setValue("productType", "tshirt")
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="presale-two-tshirts-24"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            2 T-Shirts x $24.99
                                        </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="presale-bogo"
                                            checked={presaleBogoEnabled}
                                            disabled={presaleProductType !== "hoodie"}
                                            onCheckedChange={(checked) => {
                                                setPresaleBogoEnabled(checked as boolean)
                                                if (checked) {
                                                    setPresaleTwoTshirtsEnabled(false)
                                                    setPresaleTwoTshirts24Enabled(false)
                                                }
                                            }}
                                        />
                                        <Label
                                            htmlFor="presale-bogo"
                                            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${presaleProductType === "hoodie" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                        >
                                            BOGO Hoodie + Tshirt {presaleProductType !== "hoodie" && "(Select Hoodie first)"}
                                        </Label>
                                    </div>

                                    {/* Collapsible Second Item Fields for Presale */}
                                    {(presaleTwoTshirtsEnabled || presaleTwoTshirts24Enabled || presaleBogoEnabled) && (
                                        <Collapsible open={true}>
                                            <CollapsibleContent>
                                                <div className="border rounded-lg p-4 mt-2 space-y-3 bg-muted/50">
                                                    <h3 className="text-sm font-semibold">
                                                        {(presaleTwoTshirtsEnabled || presaleTwoTshirts24Enabled) ? "Second T-Shirt Details" : "Free T-Shirt Details"}
                                                    </h3>

                                                    <Field>
                                                        <FieldLabel>Color</FieldLabel>
                                                        <Select
                                                            value={presaleSecondColor}
                                                            onValueChange={setPresaleSecondColor}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a color" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {colors.map((color) => (
                                                                        <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Design</FieldLabel>
                                                        <Select
                                                            value={presaleSecondDesign}
                                                            onValueChange={setPresaleSecondDesign}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a design" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {designs.map((design) => (
                                                                        <SelectItem key={design.value} value={design.value}>{design.label}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Size</FieldLabel>
                                                        <Select
                                                            value={presaleSecondSize}
                                                            onValueChange={setPresaleSecondSize}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a size" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {sizes.map((size) => (
                                                                        <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )}

                                    <Controller
                                        name="price"
                                        control={presaleForm.control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Price $USD (Updated Automatically)</FieldLabel>
                                                <Input disabled {...field} value={`$${field.value.toFixed(2)}`} readOnly placeholder="Price" />
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="notes"
                                        control={presaleForm.control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel>Additional Notes</FieldLabel>
                                                <Textarea {...field} className="resize-none" placeholder="Full Name/Phone Number/Email?" />
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col justify-center items-center gap-3 px-4">
                            <Button
                                type="submit"
                                form="presale-form"
                                variant="destructive"
                            >Submit</Button>
                            <Button variant="ghost" onClick={() => presaleForm.reset()}>Cancel</Button>
                            <CardDescription>v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025</CardDescription>
                        </CardFooter>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

            <Card className="w-[90%] max-w-[500px] mx-auto my-4">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Record Sale 🤩</CardTitle>
                    <CardDescription>
                        Please use this after every transaction so that we can keep track of our sales and inventory :)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="sales-form" onSubmit={form.handleSubmit(handleFormSubmission)}>
                        <FieldGroup>
                            <Controller
                                name="productType"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Type of Product Sold</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a product type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {productTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="color"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Color</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={productType === "sticker"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={productType === "sticker" ? "N/A for stickers" : "Select a color"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {colors.map((color) => (
                                                        <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="design"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Design</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a design" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {getAvailableDesigns(productType).map((design) => (
                                                        <SelectItem key={design.value} value={design.value}>{design.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="size"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Size</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={productType === "sticker"}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={productType === "sticker" ? "N/A for stickers" : "Select a size"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {sizes.map((size) => (
                                                        <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="transactionType"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Transaction Type</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a transaction type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {transactionTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="seller"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Seller (Optional)</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a seller" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {SELLERS.map((seller) => (
                                                        <SelectItem key={seller} value={seller}>{seller}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                            {/* Discount Checkboxes */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="sales-discount"
                                    checked={applyDiscount}
                                    onCheckedChange={(checked) => setApplyDiscount(checked as boolean)}
                                />
                                <Label
                                    htmlFor="sales-discount"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Apply $2 Discount
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="sales-large-discount"
                                    checked={applyLargeDiscount}
                                    onCheckedChange={(checked) => setApplyLargeDiscount(checked as boolean)}
                                />
                                <Label
                                    htmlFor="sales-large-discount"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Apply $15 Discount
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="sales-30-percent-off"
                                    checked={apply30PercentOff}
                                    onCheckedChange={(checked) => setApply30PercentOff(checked as boolean)}
                                />
                                <Label
                                    htmlFor="sales-30-percent-off"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    30% Off (T-shirt: $17.50, Hoodie: $34.99)
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="sales-10-off-tshirts"
                                    checked={applyTenOffTshirts}
                                    disabled={productType !== "tshirt"}
                                    onCheckedChange={(checked) => setApplyTenOffTshirts(checked as boolean)}
                                />
                                <Label
                                    htmlFor="sales-10-off-tshirts"
                                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${productType === "tshirt" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                >
                                    $10 Off T-Shirts ($14.99)
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="sales-50-percent-off-hoodie"
                                    checked={apply50PercentOffHoodie}
                                    disabled={productType !== "hoodie"}
                                    onCheckedChange={(checked) => setApply50PercentOffHoodie(checked as boolean)}
                                />
                                <Label
                                    htmlFor="sales-50-percent-off-hoodie"
                                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${productType === "hoodie" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                >
                                    50% Off Hoodie ($24.99)
                                </Label>
                            </div>

                            {/* Multi-Item Sale Checkboxes */}
                            <Separator className="my-2" />
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="two-tshirts"
                                    checked={twoTshirtsEnabled}
                                    onCheckedChange={(checked) => {
                                        setTwoTshirtsEnabled(checked as boolean)
                                        if (checked) {
                                            setTwoTshirts24Enabled(false)
                                            setBogoEnabled(false)
                                            form.setValue("productType", "tshirt")
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor="two-tshirts"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    2 T-Shirts x $34.99
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="two-tshirts-24"
                                    checked={twoTshirts24Enabled}
                                    onCheckedChange={(checked) => {
                                        setTwoTshirts24Enabled(checked as boolean)
                                        if (checked) {
                                            setTwoTshirtsEnabled(false)
                                            setBogoEnabled(false)
                                            form.setValue("productType", "tshirt")
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor="two-tshirts-24"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    2 T-Shirts x $24.99
                                </Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="bogo"
                                    checked={bogoEnabled}
                                    disabled={productType !== "hoodie"}
                                    onCheckedChange={(checked) => {
                                        setBogoEnabled(checked as boolean)
                                        if (checked) {
                                            setTwoTshirtsEnabled(false)
                                            setTwoTshirts24Enabled(false)
                                        }
                                    }}
                                />
                                <Label
                                    htmlFor="bogo"
                                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${productType === "hoodie" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                                >
                                    BOGO Hoodie + Tshirt {productType !== "hoodie" && "(Select Hoodie first)"}
                                </Label>
                            </div>

                            {/* Collapsible Second Item Fields */}
                            {(twoTshirtsEnabled || twoTshirts24Enabled || bogoEnabled) && (
                                <Collapsible open={true}>
                                    <CollapsibleContent>
                                        <div className="border rounded-lg p-4 mt-2 space-y-3 bg-muted/50">
                                            <h3 className="text-sm font-semibold">
                                                {(twoTshirtsEnabled || twoTshirts24Enabled) ? "Second T-Shirt Details" : "Free T-Shirt Details"}
                                            </h3>

                                            <Field>
                                                <FieldLabel>Color</FieldLabel>
                                                <Select
                                                    value={secondColor}
                                                    onValueChange={setSecondColor}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a color" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {colors.map((color) => (
                                                                <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Design</FieldLabel>
                                                <Select
                                                    value={secondDesign}
                                                    onValueChange={setSecondDesign}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a design" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {designs.map((design) => (
                                                                <SelectItem key={design.value} value={design.value}>{design.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Size</FieldLabel>
                                                <Select
                                                    value={secondSize}
                                                    onValueChange={setSecondSize}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a size" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {sizes.map((size) => (
                                                                <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}

                            <Controller
                                name="price"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Price $USD (Updated Automatically)</FieldLabel>
                                        <Input disabled {...field} value={`$${field.value.toFixed(2)}`} readOnly placeholder="Price" />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="notes"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Additional Notes</FieldLabel>
                                        <Textarea {...field} className="resize-none" placeholder="Boy/Girl/Useful Information?" />
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col justify-center items-center gap-3 px-4">
                    <Button
                        type="submit"
                        form="sales-form"
                        variant="destructive"
                    >Submit</Button>
                    <Button variant="ghost" onClick={() => form.reset()}>Cancel</Button>
                    <CardDescription>v0.2.0 | Made by Juansito with a LOT of love ❤️ ©2025</CardDescription>
                </CardFooter>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Submission</DialogTitle>
                        <DialogDescription>
                            Please review the information before submitting.
                        </DialogDescription>
                    </DialogHeader>
                    {formData && (
                        <div className="space-y-2">
                            <div>
                                <h3 className="font-semibold mb-2">
                                    {twoTshirtsEnabled ? "First T-Shirt" : twoTshirts24Enabled ? "First T-Shirt" : bogoEnabled ? "Hoodie" : "Item Details"}
                                </h3>
                                <p><strong>Product Type:</strong> {productTypes.find(p => p.value === formData.productType)?.label}</p>
                                <p><strong>Color:</strong> {colors.find(c => c.value === formData.color)?.label}</p>
                                <p><strong>Design:</strong> {designs.find(d => d.value === formData.design)?.label}</p>
                                <p><strong>Size:</strong> {sizes.find(s => s.value === formData.size)?.label}</p>
                            </div>

                            {(twoTshirtsEnabled || twoTshirts24Enabled || bogoEnabled) && secondColor && secondDesign && secondSize && (
                                <div className="border-t pt-2">
                                    <h3 className="font-semibold mb-2">
                                        {(twoTshirtsEnabled || twoTshirts24Enabled) ? "Second T-Shirt" : "Free T-Shirt"}
                                    </h3>
                                    <p><strong>Product Type:</strong> T-Shirt</p>
                                    <p><strong>Color:</strong> {colors.find(c => c.value === secondColor)?.label}</p>
                                    <p><strong>Design:</strong> {designs.find(d => d.value === secondDesign)?.label}</p>
                                    <p><strong>Size:</strong> {sizes.find(s => s.value === secondSize)?.label}</p>
                                </div>
                            )}

                            <div className="border-t pt-2">
                                <p><strong>Total Price:</strong> ${formData.price.toFixed(2)}</p>
                                <p><strong>Transaction Type:</strong> {transactionTypes.find(t => t.value === formData.transactionType)?.label}</p>
                                {formData.seller && <p><strong>Seller:</strong> {formData.seller}</p>}
                                {formData.notes && <p><strong>Notes:</strong> {formData.notes}</p>}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success!</DialogTitle>
                        <DialogDescription>
                            The sale has been saved successfully.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsSuccessDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Presale Dialogs */}
            <Dialog open={isPresaleDialogOpen} onOpenChange={setIsPresaleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Presale</DialogTitle>
                        <DialogDescription>
                            Please review the presale details below before submitting.
                        </DialogDescription>
                    </DialogHeader>
                    {presaleFormData && (
                        <div className="space-y-2">
                            <div>
                                <h3 className="font-semibold mb-2">
                                    {presaleTwoTshirtsEnabled ? "First T-Shirt" : presaleTwoTshirts24Enabled ? "First T-Shirt" : presaleBogoEnabled ? "Hoodie" : "Item Details"}
                                </h3>
                                <p><strong>Product Type:</strong> {productTypes.find(p => p.value === presaleFormData.productType)?.label}</p>
                                <p><strong>Color:</strong> {colors.find(c => c.value === presaleFormData.color)?.label}</p>
                                <p><strong>Design:</strong> {designs.find(d => d.value === presaleFormData.design)?.label}</p>
                                <p><strong>Size:</strong> {sizes.find(s => s.value === presaleFormData.size)?.label}</p>
                            </div>

                            {(presaleTwoTshirtsEnabled || presaleTwoTshirts24Enabled || presaleBogoEnabled) && presaleSecondColor && presaleSecondDesign && presaleSecondSize && (
                                <div className="border-t pt-2">
                                    <h3 className="font-semibold mb-2">
                                        {(presaleTwoTshirtsEnabled || presaleTwoTshirts24Enabled) ? "Second T-Shirt" : "Free T-Shirt"}
                                    </h3>
                                    <p><strong>Product Type:</strong> T-Shirt</p>
                                    <p><strong>Color:</strong> {colors.find(c => c.value === presaleSecondColor)?.label}</p>
                                    <p><strong>Design:</strong> {designs.find(d => d.value === presaleSecondDesign)?.label}</p>
                                    <p><strong>Size:</strong> {sizes.find(s => s.value === presaleSecondSize)?.label}</p>
                                </div>
                            )}

                            <div className="border-t pt-2">
                                <p><strong>Total Price:</strong> ${presaleFormData.price.toFixed(2)}</p>
                                <p><strong>Transaction Type:</strong> {transactionTypes.find(t => t.value === presaleFormData.transactionType)?.label}</p>
                                {presaleFormData.seller && <p><strong>Seller:</strong> {presaleFormData.seller}</p>}
                                {presaleFormData.notes && <p><strong>Notes:</strong> {presaleFormData.notes}</p>}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsPresaleDialogOpen(false)}>Cancel</Button>
                        <Button onClick={confirmPresaleSubmit} disabled={isPresaleSubmitting}>
                            {isPresaleSubmitting ? "Submitting..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isPresaleSuccessDialogOpen} onOpenChange={setIsPresaleSuccessDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success!</DialogTitle>
                        <DialogDescription>
                            The presale has been saved successfully.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsPresaleSuccessDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Monkey Backflip Dialog - shown when secret feature is enabled */}
            <Dialog open={isMonkeyDialogOpen} onOpenChange={setIsMonkeyDialogOpen}>
                <DialogContent className="w-fit max-w-[90%]">
                    <DialogHeader>
                        <DialogTitle>Success! 🙈</DialogTitle>
                        <DialogDescription>
                            The sale has been saved successfully. Enjoy this monkey backflip as a reward! 🐒🎉
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center items-center p-4">
                        <iframe
                            src="https://giphy.com/embed/fhsqerBA0ogEUoKO3g"
                            width="320"
                            height="320"
                            frameBorder="0"
                            className="giphy-embed rounded-lg mx-auto"
                            allowFullScreen
                            title="Monkey GIF"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsMonkeyDialogOpen(false)}>Awesome!</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Secret Feature Checkbox */}
            <div className="flex items-center justify-center gap-2 my-4">
                <Checkbox
                    id="secret-feature"
                    checked={secretFeatureEnabled}
                    onCheckedChange={(checked) => setSecretFeatureEnabled(checked as boolean)}
                />
                <Label
                    htmlFor="secret-feature"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                    Secret Feature
                </Label>
            </div>

            <footer className="flex flex-col my-4 w-full items-center ">
                <a rel="noopener" target="_blank" href="https://www.juanzurita.dev">Juansito</a>
            </footer>
        </ThemeProvider>
    )
}
