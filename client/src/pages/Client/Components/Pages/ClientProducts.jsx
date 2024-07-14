export const products = [
    {
      id: "1",
      name: "iPhone 14",
      description: "Short description",
      price: 2999,
      brand: "Apple",
      category: "Phone",
      inStock: true,
      images: [
        {
          color: "White",
          colorCode: "#FFFFFF",
          image: "/Assets/15pro.png",
        },
        {
          color: "Gray",
          colorCode: "#808080",
          image: "/Assets/15pro.png",
        },
      ],
      reviews: [
        {
          id: "1",
          userId: "1",
          productId: "1",
          rating: 4,
          comment: "Great phone, but a bit expensive. sbvwbrvwb vw fwh fwfw f wufbowi fw fbwfbwhf whfjhbfbjhejejejejejejejejejejejejejejejejewfbwfw fj4bfb4",
          createdDate: "2024-07-14T10:00:00.000Z",
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            image: "/images/user1.jpg",
          },
        },
      ],
    },
    {
      id: "2",
      name: "Logitech MX Keys",
      description: "Advanced wireless illuminated keyboard with tactile responsive typing.",
      price: 102.99,
      brand: "Logitech",
      category: "Accessories",
      inStock: true,
      images: [
        {
          color: "Black",
          colorCode: "#000000",
          image: "/Assets/15pro.png",
        },
      ],
      reviews: [
        {
          id: "2",
          userId: "2",
          productId: "2",
          rating: 5,
          comment: "Excellent keyboard for typing.",
          createdDate: "2024-07-14T11:00:00.000Z",
          user: {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            image: "/images/user2.jpg",
          },
        },
      ],
    },
    {
      id: "3",
      name: "Apple iPhone 13, 64GB",
      description: "Refurbished iPhone 13 with excellent condition.",
      price: 40,
      brand: "Apple",
      category: "Phone",
      inStock: true,
      images: [
        {
          color: "Black",
          colorCode: "#000000",
          image: "/Assets/15pro.png",
        },
        {
          color: "Blue",
          colorCode: "#0000FF",
          image: "/images/iphone13_blue.jpg",
        },
        {
          color: "Red",
          colorCode: "#FF0000",
          image: "/images/iphone13_red.jpg",
        },
      ],
      reviews: [
        {
          id: "3",
          userId: "3",
          productId: "3",
          rating: 4,
          comment: "Good enough. I like the camera and casing.",
          createdDate: "2024-07-14T12:00:00.000Z",
          user: {
            id: "3",
            name: "Alex Johnson",
            email: "alex@example.com",
            image: "/images/user3.jpg",
          },
        },
      ],
    },
    {
      id: "4",
      name: "Logitech MX Master 2S",
      description: "Wireless mouse with hyper-fast scrolling and ergonomic shape.",
      price: 70,
      brand: "Logitech",
      category: "Accessories",
      inStock: true,
      images: [
        {
          color: "Graphite",
          colorCode: "#383838",
          image: "/Assets/15pro.png",
        },
      ],
      reviews: [],
    },
    {
      id: "5",
      name: "Smart Watch",
      description: "Smartwatch with Bluetooth call and message reminder, fitness tracking.",
      price: 50,
      brand: "Nerunsa",
      category: "Watch",
      inStock: true,
      images: [
        {
          color: "Black",
          colorCode: "#000000",
          image: "/Assets/15pro.png",
        },
        {
          color: "Silver",
          colorCode: "#C0C0C0",
          image: "/images/smartwatch_silver.jpg",
        },
      ],
      reviews: [],
    },
  ];
  