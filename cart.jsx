// ===== Simulate getting products from a database ===== //
const products = [
  { name: "Bagel Rat:", country: "NYC, USA", cost: 3, instock: 10 },
  {
    name: "Pizza Rat:",
    country: "NYC Subway Station, Manhatten",
    cost: 4,
    instock: 3,
  },
  {
    name: "Cereal Snake:",
    country: "Trunk of a Fairy Tree, Ireland",
    cost: 1,
    instock: 8,
  },
  { name: "Wine Cat:", country: "Bordeaux, France", cost: 2, instock: 5 },
];

// ===== CART ===== //
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

// ===== Reducer to return the state of data fetch operation ===== //
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// ===== Creating the Products page ===== //
const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const { Card, Accordion, Button, Container, Row, Col, Image, Input } =
    ReactBootstrap;
  //  ===== useDataApi hook to fetch data from the API ===== //
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);

  // ===== Add items to cart, updates stock of the item ===== //
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name && item.instock > 0);
    if (item === null) return;
    item[0].instock = item[0].instock - 1;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
  };

  // ===== Delete items from cart, updates stock of the item ===== //
  const deleteCartItem = (item, index) => {
    let newCart = cart.filter((item, i) => index != i);
    for (const element of items) {
      if (element.name === item.name) {
        element.instock = element.instock + 1;
      }
    }
    setCart(newCart); // set cart to new array
  };

  const photos = [
    "./images/BagelRat.jpg",
    "./images/PizzaRat.jpeg",
    "./images/CerealSnake.jpeg",
    "./images/CatWine.jpeg",
  ];

  let list = items.map((item, index) => {
    //let n = index + 1049;
    //let url = "https://picsum.photos/id/" + n + "/50/50";
    return (
      <section key={index} className="section">
        <div className="card mb-3" max-width={540}>
          <div className="row g-0">
            <div className="col-md-4">
              <Image
                className="img"
                src={photos[index % 4]}
                width={210}
                height={210}
              ></Image>
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <h6 className="mb-3">${item.cost}</h6>
                <p className="card-text">From: {item.country}</p>
                <p className="card-text">
                  <small className="text-muted">
                    Quantity In Stock: {item.instock}
                  </small>
                </p>
                <button name={item.name} type="submit" onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  });

  let cartList = cart.map((item, index) => {
    return (
      <Accordion.Item key={1 + index} eventkey={1 + index}>
        <Accordion.Header>{item.name}</Accordion.Header>
        <Accordion.Body onClick={() => deleteCartItem(item, index)}>
          ${item.cost}
          <br />
          <br />
          <Button>Remove from Cart</Button>
          <br />
        </Accordion.Body>
      </Accordion.Item>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return <div key={index} index={index}></div>;
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`Total updated to ${newTotal}`);
    return newTotal;
  };

  // ===== To do: Re-Stock Products by making API call to url ===== //
  const restockProducts = (url) => {
    doFetch(url);
    let newItems = items.map((item) => {
      let { name, country, cost, instock } = item;
      return { name, country, cost, instock };
    });
    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col className="products">
          <h1>Product List</h1>
          <div>{list}</div>
          <br />
          <form
            onSubmit={(event) => {
              restockProducts(query, event);
              console.log(`New Restock called on ${query}`);
              event.preventDefault();
            }}
          >
            <input
              type="text"
              value={query}
              style={{ width: "260px" }}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
            <button type="submit">Re-Stock Products!</button>
          </form>
        </Col>

        <Col className="cart">
          <h1>Cart</h1>
          <h3>Cart Items:</h3>
          <Accordion defaultActiveKey="0">{cartList}</Accordion>
          <br />
          <h3>Check Out:</h3>
          <h5 className="total">Cart Total: $ {finalList().total}</h5>
          <div> {finalList().total > 0 && finalList().final} </div>
          <Button
            onClick={() => {
              if (cart.length > 0) {
                alert(`YAY! Your order has been processed!`);
                setCart([]);
              }
            }}
          >
            Checkout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
