/**
 * Shared product data for Keystone Apparel System
 * Contains product types, colors, designs, sizes, transaction types, sellers, and COGS data
 */

export const productTypes = [
    { label: "T-Shirt", value: "tshirt" },
    { label: "Hoodie", value: "hoodie" },
    { label: "Sticker", value: "sticker" },
] as const

export const colors = [
    { label: "Black", value: "black" },
    { label: "Grey", value: "grey" },
     { label: "Green", value: "green" },
    { label: "Brown", value: "brown" },
    { label: "Blue", value: "blue" },
    { label: "Pink", value: "pink" },
] as const

export const designs = [
    { label: "Child of God", value: "child-of-god" },
    { label: "Doubt Not", value: "doubt-not" },
    { label: "Line Upon Line", value: "line-upon-line" },
    { label: "Death has No Sting", value: "death-has-no-sting" },
    { label: "Endure to the End", value: "endure-to-the-end" },
    { label: "Look to God", value: "look-to-god" },
    { label: "Hands of God", value: "hands-of-god" },

    { label: "King of Kings", value: "king-of-kings" },
    { label: "Walk With Me", value: "walk-with-me" },
    { label: "Feared Man More than God", value: "feared-man-more-than-god" },
    { label: "Love Like He Did", value: "love-like-he-did" },
] as const

export const sizes = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "XL", value: "xl" },
    { label: "2XL", value: "xxl" },
    { label: "3XL", value: "xxxl" },
] as const

export const transactionTypes = [
    { label: "Card", value: "card" },
    { label: "Cash", value: "cash" },
] as const

export const SELLERS = [
    "Juan", "Lydia", "Corbyn", "Hailee", "Joseph", "Jason", "Anabella",
    "Cortland", "Diego", "Ally", "Kayla", "Makall", "Michael", "Price",
    "Katie", "Carter", "Jessica"
] as const

// Cost of Goods Sold (COGS) data for each product variant
export const cogs = [
    // Doubt Not
    { design: "doubt-not", type: "tshirt", size: "small", cogs: 9.43 },
    { design: "doubt-not", type: "tshirt", size: "medium", cogs: 8.25 },
    { design: "doubt-not", type: "tshirt", size: "large", cogs: 8.08 },
    { design: "doubt-not", type: "tshirt", size: "xl", cogs: 8.34 },
    { design: "doubt-not", type: "tshirt", size: "xxl", cogs: 8.32 },
    { design: "doubt-not", type: "tshirt", size: "xxxl", cogs: 7.76 },
    { design: "doubt-not", type: "hoodie", size: "small", cogs: 14.07 },
    { design: "doubt-not", type: "hoodie", size: "medium", cogs: 16.08 },
    { design: "doubt-not", type: "hoodie", size: "large", cogs: 14.79 },
    { design: "doubt-not", type: "hoodie", size: "xl", cogs: 17.82 },
    { design: "doubt-not", type: "hoodie", size: "xxl", cogs: 14.08 },
    { design: "doubt-not", type: "hoodie", size: "xxxl", cogs: 0 },

    // Child of God
    { design: "child-of-god", type: "tshirt", size: "small", cogs: 8.90 },
    { design: "child-of-god", type: "tshirt", size: "medium", cogs: 7.72 },
    { design: "child-of-god", type: "tshirt", size: "large", cogs: 7.55 },
    { design: "child-of-god", type: "tshirt", size: "xl", cogs: 7.81 },
    { design: "child-of-god", type: "tshirt", size: "xxl", cogs: 7.79 },
    { design: "child-of-god", type: "tshirt", size: "xxxl", cogs: 7.23 },
    { design: "child-of-god", type: "hoodie", size: "small", cogs: 13.54 },
    { design: "child-of-god", type: "hoodie", size: "medium", cogs: 15.55 },
    { design: "child-of-god", type: "hoodie", size: "large", cogs: 14.26 },
    { design: "child-of-god", type: "hoodie", size: "xl", cogs: 17.29 },
    { design: "child-of-god", type: "hoodie", size: "xxl", cogs: 13.55 },
    { design: "child-of-god", type: "hoodie", size: "xxxl", cogs: 0 },

    // Line Upon Line
    { design: "line-upon-line", type: "tshirt", size: "small", cogs: 9.57 },
    { design: "line-upon-line", type: "tshirt", size: "medium", cogs: 8.39 },
    { design: "line-upon-line", type: "tshirt", size: "large", cogs: 8.22 },
    { design: "line-upon-line", type: "tshirt", size: "xl", cogs: 8.48 },
    { design: "line-upon-line", type: "tshirt", size: "xxl", cogs: 8.46 },
    { design: "line-upon-line", type: "tshirt", size: "xxxl", cogs: 7.90 },
    { design: "line-upon-line", type: "hoodie", size: "small", cogs: 14.21 },
    { design: "line-upon-line", type: "hoodie", size: "medium", cogs: 16.22 },
    { design: "line-upon-line", type: "hoodie", size: "large", cogs: 14.93 },
    { design: "line-upon-line", type: "hoodie", size: "xl", cogs: 17.96 },
    { design: "line-upon-line", type: "hoodie", size: "xxl", cogs: 14.22 },
    { design: "line-upon-line", type: "hoodie", size: "xxxl", cogs: 0 },

    // Hands of God
    { design: "hands-of-god", type: "tshirt", size: "small", cogs: 9.43 },
    { design: "hands-of-god", type: "tshirt", size: "medium", cogs: 8.25 },
    { design: "hands-of-god", type: "tshirt", size: "large", cogs: 8.08 },
    { design: "hands-of-god", type: "tshirt", size: "xl", cogs: 8.34 },
    { design: "hands-of-god", type: "tshirt", size: "xxl", cogs: 8.32 },
    { design: "hands-of-god", type: "tshirt", size: "xxxl", cogs: 7.76 },
    { design: "hands-of-god", type: "hoodie", size: "small", cogs: 14.07 },
    { design: "hands-of-god", type: "hoodie", size: "medium", cogs: 16.08 },
    { design: "hands-of-god", type: "hoodie", size: "large", cogs: 14.79 },
    { design: "hands-of-god", type: "hoodie", size: "xl", cogs: 17.82 },
    { design: "hands-of-god", type: "hoodie", size: "xxl", cogs: 14.08 },
    { design: "hands-of-god", type: "hoodie", size: "xxxl", cogs: 0 },

    // Endure to the End
    { design: "endure-to-the-end", type: "tshirt", size: "small", cogs: 9.29 },
    { design: "endure-to-the-end", type: "tshirt", size: "medium", cogs: 8.11 },
    { design: "endure-to-the-end", type: "tshirt", size: "large", cogs: 7.94 },
    { design: "endure-to-the-end", type: "tshirt", size: "xl", cogs: 8.20 },
    { design: "endure-to-the-end", type: "tshirt", size: "xxl", cogs: 8.18 },
    { design: "endure-to-the-end", type: "tshirt", size: "xxxl", cogs: 7.62 },
    { design: "endure-to-the-end", type: "hoodie", size: "small", cogs: 13.93 },
    { design: "endure-to-the-end", type: "hoodie", size: "medium", cogs: 15.94 },
    { design: "endure-to-the-end", type: "hoodie", size: "large", cogs: 14.65 },
    { design: "endure-to-the-end", type: "hoodie", size: "xl", cogs: 17.68 },
    { design: "endure-to-the-end", type: "hoodie", size: "xxl", cogs: 13.94 },
    { design: "endure-to-the-end", type: "hoodie", size: "xxxl", cogs: 0 },

    // Look to God
    { design: "look-to-god", type: "tshirt", size: "small", cogs: 9.41 },
    { design: "look-to-god", type: "tshirt", size: "medium", cogs: 8.23 },
    { design: "look-to-god", type: "tshirt", size: "large", cogs: 8.06 },
    { design: "look-to-god", type: "tshirt", size: "xl", cogs: 8.32 },
    { design: "look-to-god", type: "tshirt", size: "xxl", cogs: 8.30 },
    { design: "look-to-god", type: "tshirt", size: "xxxl", cogs: 7.74 },
    { design: "look-to-god", type: "hoodie", size: "small", cogs: 14.05 },
    { design: "look-to-god", type: "hoodie", size: "medium", cogs: 16.06 },
    { design: "look-to-god", type: "hoodie", size: "large", cogs: 14.77 },
    { design: "look-to-god", type: "hoodie", size: "xl", cogs: 17.80 },
    { design: "look-to-god", type: "hoodie", size: "xxl", cogs: 14.06 },
    { design: "look-to-god", type: "hoodie", size: "xxxl", cogs: 0 },

    // Death Has No Sting
    { design: "death-has-no-sting", type: "tshirt", size: "small", cogs: 9.57 },
    { design: "death-has-no-sting", type: "tshirt", size: "medium", cogs: 8.39 },
    { design: "death-has-no-sting", type: "tshirt", size: "large", cogs: 8.22 },
    { design: "death-has-no-sting", type: "tshirt", size: "xl", cogs: 8.48 },
    { design: "death-has-no-sting", type: "tshirt", size: "xxl", cogs: 8.46 },
    { design: "death-has-no-sting", type: "tshirt", size: "xxxl", cogs: 7.90 },
    { design: "death-has-no-sting", type: "hoodie", size: "small", cogs: 14.21 },
    { design: "death-has-no-sting", type: "hoodie", size: "medium", cogs: 16.22 },
    { design: "death-has-no-sting", type: "hoodie", size: "large", cogs: 14.93 },
    { design: "death-has-no-sting", type: "hoodie", size: "xl", cogs: 17.96 },
    { design: "death-has-no-sting", type: "hoodie", size: "xxl", cogs: 14.22 },
    { design: "death-has-no-sting", type: "hoodie", size: "xxxl", cogs: 0 },

    //King of Kings
    { design: "king-of-kings", type: "tshirt", size: "small", cogs: 9.34 },
    { design: "king-of-kings", type: "tshirt", size: "medium", cogs: 8.16 },
    { design: "king-of-kings", type: "tshirt", size: "large", cogs: 7.99 },
    { design: "king-of-kings", type: "tshirt", size: "xl", cogs: 8.25 },
    { design: "king-of-kings", type: "tshirt", size: "xxl", cogs: 8.23 },
    { design: "king-of-kings", type: "tshirt", size: "xxxl", cogs: 7.67 },
    { design: "king-of-kings", type: "hoodie", size: "small", cogs: 13.98 },
    { design: "king-of-kings", type: "hoodie", size: "medium", cogs: 15.99 },
    { design: "king-of-kings", type: "hoodie", size: "large", cogs: 14.70 },
    { design: "king-of-kings", type: "hoodie", size: "xl", cogs: 17.73 },
    { design: "king-of-kings", type: "hoodie", size: "xxl", cogs: 13.99 },
    { design: "king-of-kings", type: "hoodie", size: "xxxl", cogs: 0 },

    // Walk With Me
    { design: "walk-with-me", type: "tshirt", size: "small", cogs: 9.32 },
    { design: "walk-with-me", type: "tshirt", size: "medium", cogs: 8.14 },
    { design: "walk-with-me", type: "tshirt", size: "large", cogs: 7.97 },
    { design: "walk-with-me", type: "tshirt", size: "xl", cogs: 8.23 },
    { design: "walk-with-me", type: "tshirt", size: "xxl", cogs: 8.21 },
    { design: "walk-with-me", type: "tshirt", size: "xxxl", cogs: 7.65 },
    { design: "walk-with-me", type: "hoodie", size: "small", cogs: 13.96 },
    { design: "walk-with-me", type: "hoodie", size: "medium", cogs: 15.50 },
    { design: "walk-with-me", type: "hoodie", size: "large", cogs: 14.21 },
    { design: "walk-with-me", type: "hoodie", size: "xl", cogs: 26.56 },
    { design: "walk-with-me", type: "hoodie", size: "xxl", cogs: 21.64 },
    { design: "walk-with-me", type: "hoodie", size: "xxxl", cogs: 0 },

    // Feared Man More than God
    { design: "feared-man-more-than-god", type: "tshirt", size: "small", cogs: 9.41 },
    { design: "feared-man-more-than-god", type: "tshirt", size: "medium", cogs: 8.23 },
    { design: "feared-man-more-than-god", type: "tshirt", size: "large", cogs: 8.06 },
    { design: "feared-man-more-than-god", type: "tshirt", size: "xl", cogs: 8.32 },
    { design: "feared-man-more-than-god", type: "tshirt", size: "xxl", cogs: 8.30 },
    { design: "feared-man-more-than-god", type: "tshirt", size: "xxxl", cogs: 7.74 },
    { design: "feared-man-more-than-god", type: "hoodie", size: "small", cogs: 14.05 },
    { design: "feared-man-more-than-god", type: "hoodie", size: "medium", cogs: 16.06 },
    { design: "feared-man-more-than-god", type: "hoodie", size: "large", cogs: 14.77 },
    { design: "feared-man-more-than-god", type: "hoodie", size: "xl", cogs: 17.80 },
    { design: "feared-man-more-than-god", type: "hoodie", size: "xxl", cogs: 14.06 },
    { design: "feared-man-more-than-god", type: "hoodie", size: "xxxl", cogs: 0 },

    // Love Like He Did
    { design: "love-like-he-did", type: "tshirt", size: "small", cogs: 9.38 },
    { design: "love-like-he-did", type: "tshirt", size: "medium", cogs: 8.20 },
    { design: "love-like-he-did", type: "tshirt", size: "large", cogs: 8.03 },
    { design: "love-like-he-did", type: "tshirt", size: "xl", cogs: 8.29 },
    { design: "love-like-he-did", type: "tshirt", size: "xxl", cogs: 8.27 },
    { design: "love-like-he-did", type: "tshirt", size: "xxxl", cogs: 7.71 },
    { design: "love-like-he-did", type: "hoodie", size: "small", cogs: 14.02 },
    { design: "love-like-he-did", type: "hoodie", size: "medium", cogs: 16.03 },
    { design: "love-like-he-did", type: "hoodie", size: "large", cogs: 14.74 },
    { design: "love-like-he-did", type: "hoodie", size: "xl", cogs: 17.77 },
    { design: "love-like-he-did", type: "hoodie", size: "xxl", cogs: 14.03 },
    { design: "love-like-he-did", type: "hoodie", size: "xxxl", cogs: 0 },

    // Stickers
    { design: "endure-to-the-end", type: "sticker", size: "one-size", cogs: 0.29 },
    { design: "doubt-not", type: "sticker", size: "one-size", cogs: 0.29 },
] as const

// Type exports for use in other files
export type ProductType = typeof productTypes[number]["value"]
export type Color = typeof colors[number]["value"]
export type Design = typeof designs[number]["value"]
export type Size = typeof sizes[number]["value"]
export type TransactionType = typeof transactionTypes[number]["value"]
export type Seller = typeof SELLERS[number]
