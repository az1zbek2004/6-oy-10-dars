import { Container, Box, Input, Button, TextField, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Registr() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const repassword = useRef();
  const description = useRef();
  const [isAlert, setAlert] = useState(false);
  const [isWords, setWords] = useState('CANNOT BE EMPTY');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function validate( username, email, password, repassword) {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if (!username.current.value) {
      username.current.focus();
      setAlert(true);
      setWords('The username cannot be empty!!')
      return false;
    }
    if (!email.current.value) {
      email.current.focus();
      setAlert(true);
      setWords('The email cannot be empty!')
      return false;
    }
    if (!email.current.value.match(validRegex)) {
      email.current.focus();
      setAlert(true);
      setWords('Invalid email adress! (Example:test@gmail.com)')
      return false;
    }
    if (!password.current.value) {
      password.current.focus();
      setAlert(true);
      setWords("The password cannot be empty!")
      return false;
    }
    if (!repassword.current.value) {
      repassword.current.focus();
      setAlert(true);
      setWords("Enter your password again!")
      return false;
    }
    if (password.current.value.length < 4 ) {
      password.current.focus();
      setAlert(true);
      setWords("Password must be longer than 3 characters!")
      return false;
    }
    if (password.current.value != repassword.current.value) {
      password.current.focus();
      repassword.current.value = '';
      setAlert(true);
      setWords("Please re-enter your password!")
      return false;
    }

    return true;
  }

  function handleClick(e) {
    e.preventDefault();
    setIsLoading(true);
    const isValid = validate(username, email, password, repassword);
    if (isValid) {
      setAlert(false);
      setWords("CANNOT BE EMPTY");
      const user = {
        username:username.current.value,
        email:email.current.value,
        password:password.current.value,
      }

      // FETCH
      fetch(`${import.meta.env.VITE_API}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.message == "User registered successfully!") {
          setAlert(false);
          setWords("CANNOT BE EMPTY");
          navigate('/login', {state: {data: data.id}});
        }
        if (data.message == "Failed! Username is already in use!") {
          setAlert(true);
          setWords("Failed! Username is already in use");
        }
        if (data.message == "Failed! Email is already in use!") {
          setAlert(true);
          setWords("Failed! Email is already in use!");
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false)
      })

    }
  }

  return (
    <Container sx={{ width: "800px" }}>
      <Typography
        marginTop={"20px"}
        textTransform={"uppercase"}
        textAlign={"center"}
        variant="h3"
        gutterBottom
      >
        Registr Page
      </Typography>
      <Box
        sx={{
          py: 2,
          display: "grid",
          borderColor: "lightgrey",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "10px",
          padding: "30px",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          textTransform={"uppercase"}
          textAlign={"center"}
          variant="h4"
        >
          users data
        </Typography>{" "}
        <hr />
        {isAlert && <Alert severity="error">{isWords}</Alert>}
        <Input
          inputRef={username}
          type="text"
          placeholder="Username in here…"
          variant="soft"
        />
        <Input
          inputRef={email}
          type="email"
          placeholder="Email in here…"
          variant="outlined"
        />
        <Input
          inputRef={password}
          type="password"
          placeholder="Password in here…"
          variant="plain"
        />
        <Input
          inputRef={repassword}
          type="password"
          placeholder="Repassword in here…"
          variant="plain"
        />
        <TextField
          id="outlined-multiline-flexible"
          label="Description"
          multiline
          maxRows={4}
          inputRef={description}
        />
      </Box>
      <Button
        onClick={handleClick}
        sx={{ my: "12px" }}
        fullWidth
        variant="contained"
        disabled = {isLoading ? true: false}
      >
       {isLoading ? 'loading...' :  'save'}
      </Button>
    </Container>
  );
}

export default Registr;
