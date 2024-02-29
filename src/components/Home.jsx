import {
  Table,
  Container,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Input,
  Alert,
  Stack,
  Skeleton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useRef, useState } from "react";

function Home() {
  const [products, setProducts] = useState([]);
  const [isAlert, setAlert] = useState(false);
  const [isWords, setWords] = useState("CANNOT BE EMPTY");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [deleted, setDeleted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const name = useRef();
  const price = useRef();
  const description = useRef();

  function validate(name, price) {
    if (!name.current.value) {
      name.current.focus();
      setAlert(true);
      setIsLoading(false);
      setWords('The phone name cannot be empty!!')
      return false;
    }
    if (!price.current.value) {
      price.current.focus();
      setAlert(true);
      setIsLoading(false);
      setWords("The price cannot be empty!")
      return false;
    }
    if (price.current.value.length < 2 ) {
      price.current.focus();
      setAlert(true);
      setIsLoading(false);
      setWords("price must be longer than 2 number!")
      return false;
    }

    return true;
  }
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/api/products/all`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function deleteIcon(id) {
    setDeleted(false);
    const isDelete = confirm("Rostdan ham o'chirmoqchimisiz?");
    if (isDelete) {
      fetch(`${import.meta.env.VITE_API}/api/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "Mahsulot muvaffaqiyatli o'chirildi") {
            let copied = JSON.parse(JSON.stringify(products));
            copied = copied.filter((product) => {
              return product.id != id;
            });
            setProducts(copied);
            setDeleted(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setDeleted(true);
        });
    }
  }

  function handleClick(e) {
    e.preventDefault();
    setIsLoading(true)
    let phone = {
      name: name.current.value,
      price: price.current.value,
      description: description.current.value,
    };


    const isValid = validate(name, price);
    if (isValid) {
      setAlert(false);

       // FETCH
       fetch(`${import.meta.env.VITE_API}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(phone)
      })
      .then(res => res.json())
      .then(data => {
        let copied = JSON.parse(JSON.stringify(products));
        if (data.id) {
          copied.push(data);
          setProducts(copied)
          name.current.value = '',
          price.current.value = '',
          description.current.value = '',
          name.current.focus()
          setIsLoading(false)
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false)
      })
    }
  }

  return (
    <>
      <Container>
        {
          !isLoading
          ?
          <Box
          sx={{
            py: 2,
            display: "grid",
            borderColor: "lightgrey",
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "10px",
            padding: "30px",
            maxWidth: 1000,
            mx: "auto",
            my: "18px",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography
            textTransform={"uppercase"}
            textAlign={"center"}
            variant="h4"
            color={"black"}
          >
            Phone Products
          </Typography>
          <hr />
          {isAlert && <Alert severity="error"sx={{color: 'black', bgcolor: 'pink'}}>{isWords}</Alert>}
          <Input
            type="text"
            placeholder="Phone name in here…"
            variant="soft"
            inputRef={name}
          />
          <Input
            type="number"
            placeholder="Price in here…"
            variant="plain"
            inputRef={price}
          />
          <Input
            type="text"
            placeholder="Description in here…"
            variant="plain"
            inputRef={description}
          />
          <Button
            onClick={handleClick}
            sx={{ bgcolor: "lightblue", color: "black" }}
          >
            Phone add
          </Button>
          </Box>
          :
          <Box sx={{ width: 1000, mx: 'auto', my: '0' }}>
          <Skeleton sx={{height: '60px'}}/>
          <Skeleton sx={{height: '60px'}} animation="wave" />
          <Skeleton sx={{height: '60px'}} animation={false} />
        </Box>
        }
        <TableContainer>
          <Table
            sx={{
              maxWidth: 1000,
              mx: "auto",
              border: "1px solid lightgrey",
              mt: "10px",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>N/n</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products[0] &&
                products.map((product, index) => {
                  return (
                    <TableRow
                      key={product.id}
                      sx={
                        index % 2 == 0
                          ? { background: "lightgrey" }
                          : { background: "light" }
                      }
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price}$</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell sx={{ display: "flex", alignItems: "center" }}>
                        <EditIcon
                          sx={{
                            borderRadius: "3px",
                            bgcolor: "grey",
                            cursor: "pointer",
                          }}
                        ></EditIcon>
                        {deleted ? (
                          <DeleteIcon
                            onClick={() => {
                              deleteIcon(product.id);
                            }}
                            sx={{
                              borderRadius: "3px",
                              bgcolor: "grey",
                              ml: "5px",
                              cursor: "pointer",
                            }}
                          ></DeleteIcon>
                        ) : (
                          <Typography
                            sx={{ color: "black", fontSize: "10px", ml: "5px" }}
                          >
                            O'chirilmoqda...
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default Home;
