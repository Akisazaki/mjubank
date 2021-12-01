import { Box, Button, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Dashboard } from "../components/Dashboard";
import { LoadingScreen } from "../components/LoadingScreen";
import { Account } from '../model/entity/account';
import { getApi } from '../utils/Config';

interface AccountCardProps {
  account: Account
}

function AccountCard(props: AccountCardProps) {
  const { account } = props
  let type = '일반 계좌'
  switch (account.account_type) {
    case 1:
      type = "적금 계좌"
      break
    case 2:
      type = "당좌 계좌"
      break
    default:
      type = "일반 계좌"
      break
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{type}</Typography>
        <Typography variant="h5">계좌번호: {account.account_id}</Typography>
        <Typography>개설일: {account.created_at.toString()}</Typography>
        <Typography variant="h4">&#8361; {account.balance}</Typography>
        <Link to={'/accounts/' + account.account_id}>상세보기</Link>
      </CardContent>
    </Card>
  )
}

export function AccountPage() {

  const [loading, setLoading] = useState(false)
  // const auth = useContext(AuthContext)

  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)
  const [accountType, setAccountType] = useState(0)

  if (!loading && accounts === undefined) {
    setLoading(true)
    axios.get(getApi('/accounts'))
      .then(result => {
        const accounts = result.data as Account[]
        setAccounts(accounts)
      }).catch(error => {
        alert("계정 목록을 불러오지 못했습니다.")
        console.error(error)
      })
      .finally(() => setLoading(false))
  }

  const createAccount = () => {
    setLoading(true)
    axios.post(getApi('/accounts'), {
      accountType: accountType
    }).then(result => {
      setAccounts(result.data)
    }).catch(error => {
      alert("새 계좌를 개설하지 못했습니다.")
      console.error(error)
    }).finally(() => setLoading(false))
  }

  return (
    <Dashboard title="사용자 정보">
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
        {accounts === undefined ? <CircularProgress /> : accounts.length === 0 ?
          <>
            <Typography component="h1" variant="h5">개설된 계좌가 없습니다.</Typography>
            <Typography>첫 계좌를 개설해보세요!</Typography>
            <br />
          </> : accounts.map(account => <AccountCard account={account} key={account.account_id} />)}
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ display: 'flex', gap: 1 }}>
            <FormControl>
              <InputLabel>계좌 종류</InputLabel>
              <Select
                id="account_type"
                value={accountType}
                onChange={(event) => {
                  setAccountType(parseInt(event.target.value.toString()))
                }}>
                <MenuItem value={0}>일반 계좌</MenuItem>
                <MenuItem value={1}>적금 계좌</MenuItem>
                <MenuItem value={2}>당좌 계좌</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={createAccount}>
              계좌 개설하기
            </Button>
          </CardContent>
        </Card>
      </Box>
      <LoadingScreen open={loading} />
    </Dashboard >
  )
}