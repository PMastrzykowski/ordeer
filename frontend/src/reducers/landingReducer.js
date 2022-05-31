import pizzas from "../styles/images/pizzas.jpg";
import pasta from "../styles/images/pasta.jpg";
import desserts from "../styles/images/desserts.jpg";
import drinks from "../styles/images/drinks.jpg";
import wines from "../styles/images/wines.jpg";
import starters from "../styles/images/starters.jpg";
import greca from "../styles/images/greca.jpg";
import primavera from "../styles/images/primavera.jpg";
import diavola from "../styles/images/diavola.jpg";
import quattroFromaggi from "../styles/images/quattro-fromaggi.jpg";
import neapolitana from "../styles/images/neapolitana.jpg";
import neapolitana2 from "../styles/images/neapolitana2.jpg";
import neapolitana3 from "../styles/images/neapolitana3.jpg";
const initialState = {
    isMenuOpen: false,
    ip: "",
    useSlides: [
        {
            title: "Bar",
            description:
                "So you spend an evening with workmates over a glass of beer and all of the sudden your drink is over. Don’t lose the topic of a conversation waiting at the bar. Order online!",
        },
        {
            title: "Restaurant",
            description:
                "What’s the most horrible in restaurants’ UX? Lack of waiters when needed! Don’t make your guest wait, help your waiters!",
        },
        {
            title: "Snooker",
            description:
                "Some people may get thirsty playing snooker with friends. Nobody want’s to stop the game to make an order at the counter, right?",
        },
        {
            title: "Hotel",
            description:
                "Avoid calling reception desk, nobody is gonna take this call anyway. Ask for an iron or whatever else you need with your phone.",
        },
        {
            title: "Beach bar",
            description:
                "Don't risk your precious towel stolen! Order refreshments online!",
        },
    ],
    useSlidesSettings: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        swipeToSlide: true,
        autoplay: true,
        focusOnSelect: true,
        pauseOnFocus: true,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            }
        ],
    },
    examples: {
        customizations: {
            categories: [
                {
                    name: "Sarters",
                    id: "xJ0UA94FI",
                    images: [
                        {
                            id: "g1d5l$NXZ",
                            url: starters,
                        },
                    ],
                    items: [],
                },
                {
                    name: "Pizza",
                    id: "R27dFPYHW",
                    images: [
                        {
                            id: "LvmZY6g9I",
                            url: pizzas,
                        },
                    ],
                    items: [
                        {
                            name: "Quattro formaggi",
                            price: "10.90",
                            description: "",
                            tax: 0,
                            id: "veYfcLaKs",
                            images: [
                                {
                                    id: "GNR4KayyV",
                                    url: quattroFromaggi,
                                },
                            ],
                            specialFields: [],
                            workUnits: [],
                            available: true,
                        },
                        {
                            name: "Diavola",
                            price: "10.80",
                            description: "",
                            tax: 0,
                            id: "MqJA7oCqa",
                            images: [
                                {
                                    id: "SQHpIKvHZ",
                                    url: diavola,
                                },
                            ],
                            specialFields: [],
                            workUnits: [],
                            available: true,
                        },
                        {
                            name: "Neapolitana",
                            price: "10.90",
                            description:
                                "What makes Neapolitana so special? It is made with tomatoes and mozzarella cheese. It must be made with either San Marzano tomatoes or Pomodorino del Piennolo del Vesuvio, which grow on the volcanic plains to the south of Mount Vesuvius, and Mozzarella di Bufala Campana, a protected designation of origin cheese made with the milk from water buffalo raised in the marshlands of Campania and Lazio in a semi-wild state, or “Fior di Latte di Agerola”, a cow milk mozzarella made exclusively in the Agerola comune.",
                            tax: "23",
                            id: "5lpuM41Rz",
                            images: [
                                {
                                    id: "DI58yd4AQ2",
                                    url: neapolitana,
                                },
                                {
                                    id: "1u4KWt4$oY",
                                    url: neapolitana2,
                                },
                                {
                                    id: "zJZYdAIVF",
                                    url: neapolitana3,
                                },
                            ],
                            specialFields: [
                                {
                                    name: "Crust",
                                    type: "one",
                                    options: [
                                        {
                                            name: "Thin",
                                            id: "@1ULuZYgO",
                                            priceImpact: 0,
                                            value: true,
                                            default: true,
                                        },
                                        {
                                            name: "Thick",
                                            id: "kYCzhYoZk",
                                            priceImpact: "2",
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "With cheese",
                                            id: "Sbwh$95j7",
                                            priceImpact: "3",
                                            value: false,
                                            default: false,
                                        },
                                    ],
                                    id: "DUR2OEy2x",
                                },
                                {
                                    name: "Add ons",
                                    type: "many",
                                    options: [
                                        {
                                            name: "Tomatoes",
                                            id: "UQoFUcTn2",
                                            priceImpact: "0.5",
                                            value: true,
                                            default: true,
                                        },
                                        {
                                            name: "Bacon",
                                            id: "kXKMxOK4Y",
                                            priceImpact: "0.5",
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "Mozarella",
                                            id: "Z0Q@prpGm",
                                            priceImpact: "0.5",
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "Ham",
                                            id: "yUE5BKSGh",
                                            priceImpact: "0.5",
                                            value: true,
                                            default: true,
                                        },
                                        {
                                            name: "Pepper",
                                            id: "74JyWTfrB",
                                            priceImpact: "0.5",
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "Olives",
                                            id: "J9Al5RRF4",
                                            priceImpact: "0.5",
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "Minced meat",
                                            id: "wa6cZaTxU",
                                            priceImpact: "0.5",
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "Cheddar",
                                            id: "IQMKeAH35",
                                            priceImpact: "0.5",
                                            value: true,
                                            default: true,
                                        },
                                    ],
                                    id: "g7pqZNHR0",
                                },
                                {
                                    name: "Sauce",
                                    type: "one",
                                    options: [
                                        {
                                            name: "Bianca",
                                            id: "0QC1B$rn9",
                                            priceImpact: 0,
                                            value: false,
                                            default: false,
                                        },
                                        {
                                            name: "Tomato sauce",
                                            id: "50rNvo7hC",
                                            priceImpact: "2",
                                            value: true,
                                            default: true,
                                        },
                                    ],
                                    id: "xZPEu8Uhc",
                                },
                            ],
                            workUnits: [],
                            available: true,
                        },
                        {
                            name: "Primavera",
                            price: "10.90",
                            description: "",
                            tax: 0,
                            id: "QrpGhDgy8",
                            images: [
                                {
                                    id: "694qy5ftz",
                                    url: primavera,
                                },
                            ],
                            specialFields: [],
                            workUnits: [],
                            available: true,
                        },
                        {
                            name: "Greca",
                            price: "10.90",
                            description: "",
                            tax: 0,
                            id: "IzqdxphLY",
                            images: [
                                {
                                    id: "rsW4DpGM8",
                                    url: greca,
                                },
                            ],
                            specialFields: [],
                            workUnits: [],
                            available: true,
                        },
                    ],
                },
                {
                    name: "Pasta",
                    id: "Z9PR3gHm3",
                    images: [
                        {
                            id: "ycwgpuLLG",
                            url: pasta,
                        },
                    ],
                    items: [],
                },
                {
                    name: "Desserts",
                    id: "bacFrvUjO",
                    images: [
                        {
                            id: "8z7trOrHc",
                            url: desserts,
                        },
                    ],
                    items: [],
                },
                {
                    name: "Wine",
                    id: "HmRYNEInh",
                    images: [
                        {
                            id: "Eto3uOB1u",
                            url: wines,
                        },
                    ],
                    items: [],
                },
                {
                    name: "Drinks",
                    id: "l287w4xM6",
                    images: [
                        {
                            id: "@aB5XTY4h",
                            url: drinks,
                        },
                    ],
                    items: [],
                },
            ],
            selectedCategory: {
                name: "Pizza",
                id: "R27dFPYHW",
                images: [
                    {
                        id: "LvmZY6g9I",
                        url:
                            "http://res.cloudinary.com/duqi6fe19/image/upload/v1586862736/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/LvmZY6g9I.webp",
                    },
                ],
                items: [
                    {
                        name: "Quattro formaggi",
                        price: "10.90",
                        description: "",
                        tax: 0,
                        id: "veYfcLaKs",
                        images: [
                            {
                                id: "GNR4KayyV",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1602582679/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/veYfcLaKs/GNR4KayyV.webp",
                            },
                        ],
                        specialFields: [],
                        workUnits: [],
                        available: true,
                    },
                    {
                        name: "Diavola",
                        price: "10.80",
                        description: "",
                        tax: 0,
                        id: "MqJA7oCqa",
                        images: [
                            {
                                id: "SQHpIKvHZ",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1602582776/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/MqJA7oCqa/SQHpIKvHZ.webp",
                            },
                        ],
                        specialFields: [],
                        workUnits: [],
                        available: true,
                    },
                    {
                        name: "Neapolitana",
                        price: "10.90",
                        description:
                            "What makes Neapolitana so special? It is made with tomatoes and mozzarella cheese. It must be made with either San Marzano tomatoes or Pomodorino del Piennolo del Vesuvio, which grow on the volcanic plains to the south of Mount Vesuvius, and Mozzarella di Bufala Campana, a protected designation of origin cheese made with the milk from water buffalo raised in the marshlands of Campania and Lazio in a semi-wild state, or “Fior di Latte di Agerola”, a cow milk mozzarella made exclusively in the Agerola comune.",
                        tax: "23",
                        id: "5lpuM41Rz",
                        images: [
                            {
                                id: "DI58yd4AQ2",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1586862809/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/5lpuM41Rz/DI58yd4AQ2.webp",
                            },
                            {
                                id: "1u4KWt4$oY",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1586862810/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/5lpuM41Rz/1u4KWt4%24oY.webp",
                            },
                            {
                                id: "zJZYdAIVF",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1586983483/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/5lpuM41Rz/zJZYdAIVF.webp",
                            },
                        ],
                        specialFields: [
                            {
                                name: "Crust",
                                type: "one",
                                options: [
                                    {
                                        name: "Thin",
                                        id: "@1ULuZYgO",
                                        priceImpact: 0,
                                        value: true,
                                        default: true,
                                    },
                                    {
                                        name: "Thick",
                                        id: "kYCzhYoZk",
                                        priceImpact: "2",
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "With cheese",
                                        id: "Sbwh$95j7",
                                        priceImpact: "3",
                                        value: false,
                                        default: false,
                                    },
                                ],
                                id: "DUR2OEy2x",
                            },
                            {
                                name: "Add ons",
                                type: "many",
                                options: [
                                    {
                                        name: "Tomatoes",
                                        id: "UQoFUcTn2",
                                        priceImpact: "0.5",
                                        value: true,
                                        default: true,
                                    },
                                    {
                                        name: "Bacon",
                                        id: "kXKMxOK4Y",
                                        priceImpact: "0.5",
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "Mozarella",
                                        id: "Z0Q@prpGm",
                                        priceImpact: "0.5",
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "Ham",
                                        id: "yUE5BKSGh",
                                        priceImpact: "0.5",
                                        value: true,
                                        default: true,
                                    },
                                    {
                                        name: "Pepper",
                                        id: "74JyWTfrB",
                                        priceImpact: "0.5",
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "Olives",
                                        id: "J9Al5RRF4",
                                        priceImpact: "0.5",
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "Minced meat",
                                        id: "wa6cZaTxU",
                                        priceImpact: "0.5",
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "Cheddar",
                                        id: "IQMKeAH35",
                                        priceImpact: "0.5",
                                        value: true,
                                        default: true,
                                    },
                                ],
                                id: "g7pqZNHR0",
                            },
                            {
                                name: "Sauce",
                                type: "one",
                                options: [
                                    {
                                        name: "Bianca",
                                        id: "0QC1B$rn9",
                                        priceImpact: 0,
                                        value: false,
                                        default: false,
                                    },
                                    {
                                        name: "Tomato sauce",
                                        id: "50rNvo7hC",
                                        priceImpact: "2",
                                        value: true,
                                        default: true,
                                    },
                                ],
                                id: "xZPEu8Uhc",
                            },
                        ],
                        workUnits: [],
                        available: true,
                    },
                    {
                        name: "Primavera",
                        price: "10.90",
                        description: "",
                        tax: 0,
                        id: "QrpGhDgy8",
                        images: [
                            {
                                id: "694qy5ftz",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1602582847/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/QrpGhDgy8/694qy5ftz.webp",
                            },
                        ],
                        specialFields: [],
                        workUnits: [],
                        available: true,
                    },
                    {
                        name: "Greca",
                        price: "10.90",
                        description: "",
                        tax: 0,
                        id: "IzqdxphLY",
                        images: [
                            {
                                id: "rsW4DpGM8",
                                url:
                                    "http://res.cloudinary.com/duqi6fe19/image/upload/v1602584055/qrspots/5e80a4dec56a6e83ce8b1184/menus/Xr6Ku371l/R27dFPYHW/IzqdxphLY/rsW4DpGM8.webp",
                            },
                        ],
                        specialFields: [],
                        workUnits: [],
                        available: true,
                    },
                ],
            },
            selectedItem: {
                name: "Neapolitana",
                price: "10.90",
                description:
                    "What makes Neapolitana so special? It is made with tomatoes and mozzarella cheese. It must be made with either San Marzano tomatoes or Pomodorino del Piennolo del Vesuvio, which grow on the volcanic plains to the south of Mount Vesuvius, and Mozzarella di Bufala Campana, a protected designation of origin cheese made with the milk from water buffalo raised in the marshlands of Campania and Lazio in a semi-wild state, or “Fior di Latte di Agerola”, a cow milk mozzarella made exclusively in the Agerola comune.",
                tax: "23",
                id: "5lpuM41Rz",
                images: [
                    {
                        id: "DI58yd4AQ2",
                        url: neapolitana,
                    },
                    {
                        id: "1u4KWt4$oY",
                        url: neapolitana2,
                    },
                    {
                        id: "zJZYdAIVF",
                        url: neapolitana3,
                    },
                ],
                specialFields: [
                    {
                        name: "Crust",
                        type: "one",
                        options: [
                            {
                                name: "Thin",
                                id: "@1ULuZYgO",
                                priceImpact: 0,
                                value: true,
                                default: true,
                            },
                            {
                                name: "Thick",
                                id: "kYCzhYoZk",
                                priceImpact: "2",
                                value: false,
                                default: false,
                            },
                            {
                                name: "With cheese",
                                id: "Sbwh$95j7",
                                priceImpact: "3",
                                value: false,
                                default: false,
                            },
                        ],
                        id: "DUR2OEy2x",
                    },
                    {
                        name: "Add ons",
                        type: "many",
                        options: [
                            {
                                name: "Tomatoes",
                                id: "UQoFUcTn2",
                                priceImpact: "0.5",
                                value: true,
                                default: true,
                            },
                            {
                                name: "Bacon",
                                id: "kXKMxOK4Y",
                                priceImpact: "0.5",
                                value: true,
                                default: false,
                            },
                            {
                                name: "Mozarella",
                                id: "Z0Q@prpGm",
                                priceImpact: "0.5",
                                value: true,
                                default: false,
                            },
                            {
                                name: "Ham",
                                id: "yUE5BKSGh",
                                priceImpact: "0.5",
                                value: false,
                                default: true,
                            },
                            {
                                name: "Pepper",
                                id: "74JyWTfrB",
                                priceImpact: "0.5",
                                value: true,
                                default: false,
                            },
                            {
                                name: "Olives",
                                id: "J9Al5RRF4",
                                priceImpact: "0.5",
                                value: false,
                                default: false,
                            },
                            {
                                name: "Minced meat",
                                id: "wa6cZaTxU",
                                priceImpact: "0.5",
                                value: false,
                                default: false,
                            },
                            {
                                name: "Cheddar",
                                id: "IQMKeAH35",
                                priceImpact: "0.5",
                                value: true,
                                default: true,
                            },
                        ],
                        id: "g7pqZNHR0",
                    },
                    {
                        name: "Sauce",
                        type: "one",
                        options: [
                            {
                                name: "Bianca",
                                id: "0QC1B$rn9",
                                priceImpact: 0,
                                value: false,
                                default: false,
                            },
                            {
                                name: "Tomato sauce",
                                id: "50rNvo7hC",
                                priceImpact: "2",
                                value: true,
                                default: true,
                            },
                        ],
                        id: "xZPEu8Uhc",
                    },
                ],
                workUnits: [],
                available: true,
            },
            itemPrice: "10.90",
        },
        reviews: {
            rating: 0,
        },
    },
    sample: {
        orders: [
            // {
            //     items: [
            //         {
            //             price: 8.9,
            //             name: "Neapolitana",
            //             productId: "5lpuM41Rz",
            //             cartId: "8moWGrIGx",
            //             categoryId: "R27dFPYHW",
            //             menuId: "Xr6Ku371l",
            //             pressed: false,
            //             customizable: true,
            //             specialFields: [
            //                 {
            //                     name: "Sauce",
            //                     type: "one",
            //                     options: [
            //                         {
            //                             name: "Bianca",
            //                             id: "0QC1B$rn9",
            //                             priceImpact: 0,
            //                             value: true,
            //                             default: false,
            //                         },
            //                         {
            //                             name: "Tomato sauce",
            //                             id: "50rNvo7hC",
            //                             priceImpact: "2",
            //                             value: false,
            //                             default: true,
            //                         },
            //                     ],
            //                     id: "xZPEu8Uhc",
            //                 },
            //             ],
            //         },
            //     ],
            //     place: "6usNVV6JwndS4uDVAAAF",
            //     point: "6usNVV6JwndS4uDVAAAF",
            //     pointName: "Table 1",
            //     layout: "",
            //     layoutName: "",
            //     feature: "feature-2",
            //     total: 8.9,
            //     openDate: 1604673562262,
            //     open: false,
            //     surveysPassed: true,
            //     paymentRefund: {
            //         refunded: false,
            //         refundedBy: "",
            //         refundDate: "",
            //     },
            //     rating: 4,
            //     review: "Bardzo fajna aplikacja! Pozdrawiam wszystkich!",
            //     _id: "",
            // },
        ],
    },
    plansSlides: [
        {
            name: "Basic",
            price: "0 EUR/month",
            values: [],
        },
        {
            name: "Comfort",
            price: "25 EUR/month",
            values: [],
        },
        {
            name: "Pro",
            price: "49 EUR/month",
            values: [],
        },
        {
            name: "Max",
            price: "99 EUR/month",
            values: [],
        },
    ],
    plansSlidesSettings: {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        swipeToSlide: true,
        autoplay: false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    dots: true,
                },
            }
        ],
    },
};

export default (state = initialState, action) => {
    let newSlides = [];
    switch (action.type) {
        case "LANDING_PREVIOUS_SLIDE":
            newSlides = state.slides.slice();
            newSlides.unshift(state.slides[state.slides.length - 1]);
            newSlides.pop();
            return {
                ...state,
                slides: newSlides,
                currentSlide:
                    state.currentSlide === 0
                        ? state.slides.length - 1
                        : state.currentSlide - 1,
            };
        case "LANDING_NEXT_SLIDE":
            newSlides = state.slides.slice();
            newSlides.push(state.slides[0]);
            newSlides.shift();
            return {
                ...state,
                slides: newSlides,
                currentSlide:
                    state.currentSlide === state.slides.length - 1
                        ? 0
                        : state.currentSlide + 1,
            };
        case "LANDING_EXAMPLE_CUSTOMIZATIONS_1":
            return {
                ...state,
                examples: {
                    ...state.examples,
                    customizations: {
                        ...state.examples.customizations,
                        itemPrice: "12.90",
                        selectedItem: {
                            ...state.examples.customizations.selectedItem,
                            specialFields: state.examples.customizations.selectedItem.specialFields.map(
                                (field) =>
                                    field.id === "DUR2OEy2x"
                                        ? {
                                              ...field,
                                              options: [
                                                  {
                                                      name: "Thin",
                                                      id: "@1ULuZYgO",
                                                      priceImpact: 0,
                                                      value: false,
                                                      default: true,
                                                  },
                                                  {
                                                      name: "Thick",
                                                      id: "kYCzhYoZk",
                                                      priceImpact: "2",
                                                      value: true,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "With cheese",
                                                      id: "Sbwh$95j7",
                                                      priceImpact: "3",
                                                      value: false,
                                                      default: false,
                                                  },
                                              ],
                                          }
                                        : field
                            ),
                        },
                    },
                },
            };
        case "LANDING_EXAMPLE_CUSTOMIZATIONS_2":
            return {
                ...state,
                examples: {
                    ...state.examples,
                    customizations: {
                        ...state.examples.customizations,
                        itemPrice: "12.40",
                        selectedItem: {
                            ...state.examples.customizations.selectedItem,
                            specialFields: state.examples.customizations.selectedItem.specialFields.map(
                                (field) =>
                                    field.id === "g7pqZNHR0"
                                        ? {
                                              ...field,
                                              options: [
                                                  {
                                                      name: "Tomatoes",
                                                      id: "UQoFUcTn2",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: true,
                                                  },
                                                  {
                                                      name: "Bacon",
                                                      id: "kXKMxOK4Y",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Mozarella",
                                                      id: "Z0Q@prpGm",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Ham",
                                                      id: "yUE5BKSGh",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: true,
                                                  },
                                                  {
                                                      name: "Pepper",
                                                      id: "74JyWTfrB",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Olives",
                                                      id: "J9Al5RRF4",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Minced meat",
                                                      id: "wa6cZaTxU",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Cheddar",
                                                      id: "IQMKeAH35",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: true,
                                                  },
                                              ],
                                          }
                                        : field
                            ),
                        },
                    },
                },
            };
        case "LANDING_EXAMPLE_CUSTOMIZATIONS_3":
            return {
                ...state,
                examples: {
                    ...state.examples,
                    customizations: {
                        ...state.examples.customizations,
                        itemPrice: "12.90",
                        selectedItem: {
                            ...state.examples.customizations.selectedItem,
                            specialFields: state.examples.customizations.selectedItem.specialFields.map(
                                (field) =>
                                    field.id === "g7pqZNHR0"
                                        ? {
                                              ...field,
                                              options: [
                                                  {
                                                      name: "Tomatoes",
                                                      id: "UQoFUcTn2",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: true,
                                                  },
                                                  {
                                                      name: "Bacon",
                                                      id: "kXKMxOK4Y",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Mozarella",
                                                      id: "Z0Q@prpGm",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Ham",
                                                      id: "yUE5BKSGh",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: true,
                                                  },
                                                  {
                                                      name: "Pepper",
                                                      id: "74JyWTfrB",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Olives",
                                                      id: "J9Al5RRF4",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Minced meat",
                                                      id: "wa6cZaTxU",
                                                      priceImpact: "0.5",
                                                      value: false,
                                                      default: false,
                                                  },
                                                  {
                                                      name: "Cheddar",
                                                      id: "IQMKeAH35",
                                                      priceImpact: "0.5",
                                                      value: true,
                                                      default: true,
                                                  },
                                              ],
                                          }
                                        : field
                            ),
                        },
                    },
                },
            };
        case "LANDING_EXAMPLE_CUSTOMIZATIONS_RESET":
            return {
                ...state,
                examples: {
                    ...state.examples,
                    customizations: initialState.examples.customizations,
                },
            };
        case "LANDING_EXAMPLE_REVIEWS":
            return {
                ...state,
                examples: {
                    ...state.examples,
                    reviews: {
                        ...state.examples.reviews,
                        rating: 5,
                    },
                },
            };
        case "LANDING_EXAMPLE_REVIEWS_RESET":
            return {
                ...state,
                examples: {
                    ...state.examples,
                    reviews: initialState.examples.reviews,
                },
            };
        case "LANDING_ADD_ORDER":
            return {
                ...state,
                sample: {
                    ...state.sample,
                    orders: [action.data, ...state.sample.orders],
                },
            };
        case "LANDING_ORDER_RATING":
            return {
                ...state,
                sample: {
                    ...state.sample,
                    orders: state.sample.orders.map((order) =>
                        order._id !== action.data.id
                            ? order
                            : {
                                  ...order,
                                  surveysPassed: true,
                                  rating: action.data.rating,
                                  review: action.data.review,
                              }
                    ),
                },
            };
        case "LANDING_CLOSE_ORDER":
            return {
                ...state,
                sample: {
                    ...state.sample,
                    orders: state.sample.orders.map((order) =>
                        order._id !== action.data._id
                            ? order
                            : { ...order, open: false }
                    ),
                },
            };
        case "LANDING_TOGGLE_MENU":
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen,
            };
        case "LANDING_SET_IP":
            return {
                ...state,
                ip: action.ip,
            };
        case "LANDING_RESET":
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
