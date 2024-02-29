import { Container, Box, Input, Button, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const username = useRef();
  const password = useRef();
  const [isAlert, setAlert] = useState(false);
  const [isWords, setWords] = useState('CANNOT BE EMPTY');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function validate( username, password) {

    if (!username.current.value) {
      username.current.focus();
      setAlert(true);
      setWords('The username cannot be empty!!')
      return false;
    }
    if (!password.current.value) {
      password.current.focus();
      setAlert(true);
      setIsLoading(false);
      setWords("The password cannot be empty!")
      return false;
    }
    if (password.current.value.length < 4 ) {
      password.current.focus();
      setAlert(true);
      setIsLoading(false);
      setWords("Password must be longer than 3 characters!")
      return false;
    }

    return true;
  }

  function handleClick(e) {
    e.preventDefault();
    setIsLoading(true);
    const isValid = validate(username, password);
    if (isValid) {
      setAlert(false);
      setWords("CANNOT BE EMPTY");
      const user = {
        username:username.current.value,
        password:password.current.value,
      }

      // FETCH
      fetch(`${import.meta.env.VITE_API}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.id) {
          localStorage.setItem('token', JSON.stringify(data.accessToken));
          navigate('/');
        }
        if (data.message == "Invalid Password!") {
          setAlert(true);
          setWords("Invalid Password!");
        }
        if (data.message == "User Not found.") {
          setAlert(true);
          setWords("User Not found.");
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false)
      })

    } else {
      setIsLoading(false)
    }
  }

  return (
    <Container sx={{ width: "800px" }}>
      <Typography
        marginTop={"20px"}
        textTransform={"uppercase"}
        textAlign={"center"}
        variant="h3"
        color={'black'}
        gutterBottom
      >
        Login Page
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
          color={'black'}
        >
          login data
        </Typography>
        <hr />
        {isAlert && <Alert severity="error" sx={{bgcolor: 'pink'}}>{isWords}</Alert>}
        <Input
          inputRef={username}
          type="text"
          placeholder="Username in here…"
          variant="soft"
        />
        <Input
          inputRef={password}
          type="password"
          placeholder="Password in here…"
          variant="plain"
        />
      </Box>
      <Button
        onClick={handleClick}
        sx={{ my: "12px" }}
        fullWidth
        variant="contained"
        disabled = {isLoading ? true: false}
      >
       {isLoading ? 'loading...' :  'login'}
      </Button>
    </Container>
  );
}

export default Login;
