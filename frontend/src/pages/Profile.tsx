import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useContext, useState } from "react";
import { Dashboard } from "../components/Dashboard";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthContext } from "../utils/authProvider";
import { getApi } from '../utils/Config';


interface PasswordState {
  password: string
  passwordValidation: string
}


export function Profile() {

  const [loading, setLoading] = useState(false)
  const auth = useContext(AuthContext)
  const [user, setUser] = useState(auth.user!);
  const [passwordState, setPasswordState] = useState<PasswordState>({
    password: '',
    passwordValidation: ''
  })
  const { password, passwordValidation } = passwordState
  const passwordError = password !== passwordValidation

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    let form: { [key: string]: any } = {}
    for (var [key, value] of data.entries())
      form[key] = (value as string).trim()
    if (form.address.length === 0)
      delete form.address
    if (form.birthday.length === 0)
      delete form.birthday
    delete form.passwordValidation
    if (password.length > 0 && password === passwordValidation)
      form.password = password
    else
      delete form.password
    setLoading(true)
    axios.put(getApi('/customers'), form)
      .then(result => auth.onUpdate(result.data))
      .catch(error => {
        alert("업데이트 할 수 없습니다.")
        console.error(error)
      })
      .finally(() => setLoading(false))
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    setUser({
      ...user,
      [name]: value
    })
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    setPasswordState({
      ...passwordState,
      [name]: value
    })
  }

  return (
    <Dashboard title="사용자 정보">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="ssn"
          label="주민번호"
          name="ssn"
          disabled
          value={user.ssn}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="성함"
          type="text"
          id="name"
          value={user.name}
          onChange={handleChange}
          inputProps={{
            maxLength: 45
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          name="birthday"
          label="생년월일"
          type="date"
          id="birthday"
          value={user.birthday}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="address"
          label="청구지 주소"
          type="address"
          id="address"
          value={user.address}
          onChange={handleChange}
          inputProps={{
            maxLength: 255
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          disabled
          value={user.email}
          inputProps={{
            maxLength: 45
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          id="tel"
          label="전화번호"
          name="tel"
          type="tel"
          value={user.tel}
          onChange={handleChange}
          inputProps={{
            maxLength: 15
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          id="job"
          label="직업"
          name="job"
          type="text"
          value={user.job}
          onChange={handleChange}
          inputProps={{
            maxLength: 45
          }}
        />
        <Divider />
        <Typography component="h1" variant="h6">비밀번호</Typography>
        <Typography>변경을 원치 않으실 경우 비워두세요.</Typography>
        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          error={passwordError}
          value={password}
          onChange={onPasswordChange}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          fullWidth
          name="passwordValidation"
          label="Password Validation"
          type="password"
          id="passwordValidation"
          error={passwordError}
          value={passwordValidation}
          onChange={onPasswordChange}
          autoComplete="off"
        />
        <Box display="flex" gap="12px">
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3, mb: 2, flexGrow: 1 }}
            disabled={passwordError}>
            수정하기
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2, flexGrow: 1 }}
            onClick={() => {
              setUser(auth.user!)
              setPasswordState({
                password: '',
                passwordValidation: ''
              })
            }}>
            되돌리기
          </Button>
        </Box>
      </Box>
      <LoadingScreen open={loading} />
    </Dashboard >
  )
}