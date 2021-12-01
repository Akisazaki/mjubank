import { VerifiedUserOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { LoadingScreen } from '../components/LoadingScreen';
import { Customer } from '../model/entity/customer';
import { getApi } from '../utils/Config';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://cs.mju.ac.kr/">
        MJU Database Team 6
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme()

interface UserForm {
  ssn: number
  name: string
  birthday: string
  address: string
  email: string
  tel: string
  job: string
  password: string
  passwordValidate?: string
}

interface Props {
  onSignUp: (user: Customer) => void
}

export function SignUpPage(props: Props) {

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<UserForm>({
    ssn: 0,
    name: '',
    birthday: '',
    address: '',
    email: '',
    tel: '',
    job: '',
    password: '',
    passwordValidate: ''
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formData.password !== formData.passwordValidate) {
      alert("패스워드가 다릅니다.")
      return
    }
    let data = { ...formData }
    delete data.passwordValidate
    setLoading(true)
    axios.post(getApi('/signup'), data)
      .then(result => {
        console.log(result.data)
        props.onSignUp(result.data)
      })
      .catch(error => {
        alert("가입에 실패하였습니다.\n혹시 이미 가입하신 상태는 아닌가요?")
        console.error(error)
        setLoading(false)
      })
  }


  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget

    if (name === "ssn") {
      const ssn = parseInt(value)
      if (!isNaN(ssn) && ssn.toString().length <= 13)
        setFormData({
          ...formData,
          ssn
        })
    }
    else
      setFormData({
        ...formData,
        [name]: value
      })
  }


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <VerifiedUserOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            가입하기
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="ssn"
              label="주민번호"
              name="ssn"
              autoFocus
              inputProps={{
                type: "number",
                maxLength: 13,
                minLength: 8
              }}
              value={formData.ssn}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="성함"
              type="text"
              id="name"
              value={formData.name}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              fullWidth
              name="birthday"
              label="생년월일"
              type="date"
              id="birthday"
              value={formData.birthday}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="address"
              label="청구지 주소"
              type="address"
              id="address"
              inputProps={{
                maxLength: 255,
                minLength: 1
              }}
              value={formData.address}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              inputProps={{
                maxLength: 45,
                minLength: 1
              }}
              value={formData.email}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="tel"
              label="전화번호"
              name="tel"
              type="tel"
              inputProps={{
                maxLength: 15,
                minLength: 1
              }}
              value={formData.tel}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="job"
              label="직업"
              name="job"
              type="text"
              inputProps={{
                maxLength: 45,
                minLength: 1
              }}
              value={formData.job}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordValidate"
              label="Password Validation"
              type="password"
              id="passwordValidate"
              value={formData.passwordValidate}
              onChange={onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              가입하기
              </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <LoadingScreen open={loading} />
    </ThemeProvider>
  );
}