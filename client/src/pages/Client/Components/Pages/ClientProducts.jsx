export const products = [
    {
      id: "1",
      name: "Humanoid Robot",
      description: "Humanoid robots are robots designed to resemble and mimic human form and behavior. They typically have a torso, a head, two arms, and two legs, enabling them to perform tasks in environments built for humans. These robots are equipped with sensors, cameras, and microphones to perceive their surroundings, as well as actuators and motors to move and interact with objects. Humanoid robots are used in various fields, including healthcare, customer service, education, and entertainment, demonstrating capabilities like walking, talking, recognizing faces, and even expressing emotions. They hold significant potential for assisting humans in everyday tasks, enhancing productivity, and improving the quality of life.is is a humanoid robot use for secuirty purpose bomb detections and indoor and outdoor works ",
      price: 2999,
      brand: "Tesla",
      category: "Robots",
      discount:"10%",
      quantity:"10",
      inStock: true,
      images: [
        {
          color: "White",
          colorCode: "#FFFFFF",
          image: "/Assets/robot.png",
        },
        {
          color: "Gray",
          colorCode: "#808080",
          image: "/Assets/BTS.jpg",
        },
        {
          color: "Gray",
          colorCode: "#808080",
          image: "/Assets/BTS.jpg",
        },
        {
          color: "Gray",
          colorCode: "#808080",
          image: "/Assets/BTS.jpg",
        },
        {
          color: "Gray",
          colorCode: "#808080",
          image: "/Assets/BTS.jpg",
        },
        {
          color: "Gray",
          colorCode: "#808080",
          image: "/Assets/BTS.jpg",
        },
        
      ],
      reviews: [
        {
          id: "1",
          userId: "1",
          productId: "1",
          rating: 4,
          comment: "Great, but a bit expensive. sbvwbrvwb vw fwh fwfw f wufbowi fw fbwfbwhf whfjhbfbjhejejejejejejejejejejejejejejejejewfbwfw fj4bfb4",
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
      name: "Night Vision Portable Bulletproof Waterproof Sunglasses",
      description: "Night vision portable bulletproof waterproof sunglasses are cutting-edge eyewear designed for extreme conditions. These sunglasses incorporate night vision technology, allowing users to see clearly in low-light environments. Their bulletproof lenses provide protection against ballistic impacts, ensuring safety in hazardous situations. Additionally, they are waterproof, making them suitable for use in wet or underwater conditions. Ideal for military, law enforcement, and adventure enthusiasts, these sunglasses offer unparalleled durability and functionality.",
      price: 102.99,
      brand: "Kalashnikov",
      category: "Cloths",
      discount:"50%",
      quantity:"20",
      inStock: true,
      images: [
        {
          color: "Black",
          colorCode: "#000000",
          image: "/Assets/nvsunglass.png",
        },
        {
          color: "Black",
          colorCode: "#000000",
          image: "/Assets/SWE-1.jpg",
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
      discount:"20%",
      quantity:"10",
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
      name: "Heavy duty Drone with 4K camera",
      description: "AI drones are advanced unmanned aerial vehicles (UAVs) integrated with artificial intelligence. These drones can perform autonomous flights, navigate complex environments, and make real-time decisions based on sensor data. AI capabilities enable drones to recognize objects, track targets, avoid obstacles, and execute complex tasks without human intervention. Applications of AI drones span various fields, including agriculture, surveillance, logistics, and emergency response, where they can enhance efficiency, safety, and precision..",
      price: 70,
      brand: "DJI",
      category: "Drones",
      discount:"18%",
      quantity:"10",
      inStock: true,
      images: [
        {
          color: "Graphite",
          colorCode: "#383838",
          image: "/Assets/hvdrone.png",
        },
      ],
      reviews: [{
        id: "3",
        userId: "3",
        productId: "3",
        rating: 1,
        comment: "Good enough. I like the camera and casing.",
        createdDate: "2024-07-14T12:00:00.000Z",
        user: {
          id: "3",
          name: "Alex Johnson",
          email: "alex@example.com",
          image: "/images/user3.jpg",
        },
      },],
    },
    {
      id: "5",
      name: "Smart Watch",
      description: "Smartwatch with Bluetooth call and message reminder, fitness tracking.",
      price: 50,
      brand: "Nerunsa",
      category: "Watch",
      discount:"5%",
      quantity:"10",
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
          image: "/images/15pro.jpg",
        },
      ],
      reviews: [{
        id: "3",
        userId: "3",
        productId: "3",
        rating: 2,
        comment: "Good enough. I like the camera and casing.",
        createdDate: "2024-07-14T12:00:00.000Z",
        user: {
          id: "3",
          name: "Alex Johnson",
          email: "alex@example.com",
          image: "/images/user3.jpg",
        },
      },],
    },
  
  
  {
    id: "6",
    name: "Spotter Drone",
    description: "Mini drones are compact, lightweight unmanned aerial vehicles designed for easy portability and versatility. Despite their small size, mini drones can be equipped with high-resolution cameras, GPS, and other advanced features. They are popular for recreational use, photography, and educational purposes. Mini drones are also used in professional applications, such as inspections, surveillance, and research, where their maneuverability and accessibility to tight spaces offer significant advantages. Their user-friendly design and affordability make them accessible to a broad range of users.",
    price: 2999,
    brand: "Tesla",
    category: "Robots",
    discount:"60%",
    quantity:"10",
    inStock: true,
    images: [
      {
        color: "White",
        colorCode: "#FFFFFF",
        image: "/Assets/mndrone.png",
      },
      {
        color: "Gray",
        colorCode: "#808080",
        image: "/Assets/mndrone.png",
      },
    ],
    reviews: [
      {
        id: "3",
        userId: "3",
        productId: "3",
        rating: 4,
        comment: "Humanoid robots are robots designed to resemble and mimic human form and behavior. They typically have a torso, a head, two arms, and two legs, enabling them to perform tasks in environments built for humans. These robots are equipped with sensors, cameras, and microphones to perceive their surroundings, as well as actuators and motors to move and interact with objects. Humanoid robots are used in various fields, including healthcare, customer service, education, and entertainment, demonstrating capabilities like walking, talking, recognizing faces, and even expressing emotions. They hold significant potential for assisting humans in everyday tasks, enhancing productivity, and improving the quality of life.reat, but a bit expensive. sbvwbrvwb vw fwh fwfw f wufbowi fw fbwfbwhf whfjhbfbjhejejejejejejejejejejejejejejejejewfbwfw fj4bfb4",
        createdDate: "2024-07-14T10:00:00.000Z",
        user: {
          id: "3",
          name: "John Doe",
          email: "john@example.com",
          image: "/images/user1.jpg",
        },
      },
    ],
  },

  {
    id: "7",
    name: "Humanoid Robot",
    description: "This is a humanoid robot use for secuirty purpose bomb detections and indoor and outdoor works",
    price: 2999,
    brand: "Tesla",
    category: "Robots",
    discount:"10%",
    quantity:"10",
    inStock: true,
    images: [
      {
        color: "White",
        colorCode: "#FFFFFF",
        image: "/Assets/robot.png",
      },
      {
        color: "Gray",
        colorCode: "#808080",
        image: "/Assets/robot.png",
      },
    ],
    reviews: [
      {
        id: "3",
        userId: "3",
        productId: "3",
        rating: 5,
        comment: "Great, but a bit expensive. sbvwbrvwb vw fwh fwfw f wufbowi fw fbwfbwhf whfjhbfbjhejejejejejejejejejejejejejejejejewfbwfw fj4bfb4",
        createdDate: "2024-07-14T10:00:00.000Z",
        user: {
          id: "3",
          name: "John Doe",
          email: "john@example.com",
          image: "/images/user1.jpg",
        },
      },
    ],
  },

  {
    id: "8",
    name: "Humanoid Robot",
    description: "Humanoid robots are robots designed to resemble and mimic human form and behavior. They typically have a torso, a head, two arms, and two legs, enabling them to perform tasks in environments built for humans. These robots are equipped with sensors, cameras, and microphones to perceive their surroundings, as well as actuators and motors to move and interact with objects. Humanoid robots are used in various fields, including healthcare, customer service, education, and entertainment, demonstrating capabilities like walking, talking, recognizing faces, and even expressing emotions. They hold significant potential for assisting humans in everyday tasks, enhancing productivity, and improving the quality of life.is is a humanoid robot use for secuirty purpose bomb detections and indoor and outdoor works",
    price: 2999,
    brand: "Tesla",
    category: "Robots",
    discount:"10%",
    quantity:"10",
    inStock: true,
    images: [
      {
        color: "White",
        colorCode: "#FFFFFF",
        image: "/Assets/robot.png",
      },
      {
        color: "Gray",
        colorCode: "#808080",
        image: "/Assets/robot.png",
      },
    ],
    reviews: [
      {
        id: "3",
        userId: "3",
        productId: "3",
        rating: 4,
        comment: "Great, but a bit expensive. sbvwbrvwb vw fwh fwfw f wufbowi fw fbwfbwhf whfjhbfbjhejejejejejejejejejejejejejejejejewfbwfw fj4bfb4",
        createdDate: "2024-07-14T10:00:00.000Z",
        user: {
          id: "3",
          name: "John Doe",
          email: "john@example.com",
          image: "/images/user1.jpg",
        },
      },
    ],
  },
];