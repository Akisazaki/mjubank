import { Refresh } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, useState } from "react";
import { Dashboard } from "../components/Dashboard";
import { LoadingScreen } from "../components/LoadingScreen";
import { Account } from "../model/entity/account";
import { Card as ICard } from '../model/entity/card';
import { getApi } from '../utils/Config';


function cardIdToString(id: number) {
  let ccn = id.toString()
  return `${ccn.substr(0, 4)}-${ccn.substr(4, 4)}-${ccn.substr(8, 4)}-${ccn.substr(12, 4)}`
}

interface AccountCardProps {
  card: ICard,
  updateLimit: (card: ICard, limit: number) => void,
  toggleCard: (card: ICard) => void
}

function CardView(props: AccountCardProps) {
  const { card } = props
  const [limitOpen, setLimitOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [limit, setLimit] = useState(card.limit || 0)
  function limitChange(event: ChangeEvent<HTMLInputElement>) {
    setLimit(Math.min(10000000, Math.max(100000, parseInt(event.currentTarget.value))))
  }
  function handleClose() {
    setLimitOpen(false)
    setToggleOpen(false)
  }
  let type = '일반 계좌'
  switch (card.card_type) {
    case 1:
      type = "직불 카드"
      break
    default:
      type = "신용 카드"
      break
  }
  const fullScreen = window.screen.width < 600
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">{type}</Typography>
          <Typography variant="h4">{cardIdToString(card.card_id)}</Typography>
          <Typography>연결된 계좌: {card.account_id}</Typography>
          <Typography>신청일: {card.application_date.toLocaleString()}</Typography>
          <Typography>만료일: {card.expired_at.toLocaleString()}</Typography>
          <Typography>한도: &#8361;{Math.round(card.limit || 100000)}</Typography>
          {card.dropped_at && <Typography>정지일: {card.dropped_at.toLocaleString()}</Typography>}
        </CardContent>
        <CardActions>
          <Button disabled={!!card.dropped_at} onClick={() => setLimitOpen(true)}>한도조절하기</Button>
          <Button onClick={() => setToggleOpen(true)}>{card.dropped_at ? '재개' : '정지'}하기</Button>
          {/* <Link to={'/cards/' + card.card_id}>상세보기</Link> */}
        </CardActions>
      </Card>
      <Dialog
        fullScreen={fullScreen}
        open={limitOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          한도 조절 하기
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="h4">
            {cardIdToString(card.card_id)}
          </DialogContentText>
          <DialogContentText>
            설정할 카드 한도를 알려주세요.
          </DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            name="cardLimit"
            label="카드 한도"
            type="number"
            id="cardLimit"
            onChange={limitChange}
            value={limit}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={limit === (card.limit || 0)}
            autoFocus
            onClick={() => {
              setLimitOpen(false)
              props.updateLimit(card, limit)
            }}
          >
            설정
          </Button>
          <Button autoFocus onClick={() => {
            setLimit(card.limit || 100000)
            handleClose()
          }}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={toggleOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          카드 {card.dropped_at ? '재개' : '정지'} 하기
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="h4">
            {cardIdToString(card.card_id)}
          </DialogContentText>
          <DialogContentText>
            정말로 이 카드를 {card.dropped_at ? '재개' : '정지'} 할까요?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setToggleOpen(false)
              props.toggleCard(card)
            }}
          >
            {card.dropped_at ? '재개' : '정지'}
          </Button>
          <Button autoFocus onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


export function CardListPage() {

  const [loading, setLoading] = useState(false)
  // const auth = useContext(AuthContext)

  const [cards, setCards] = useState<ICard[] | undefined>(undefined)
  const [cardType, _setCardType] = useState(0)
  const [connectedAccount, setConnectedAccount] = useState(0)
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined)

  function setCardType(type: number) {
    _setCardType(type)
    setAccounts(undefined)
    setConnectedAccount(0)
    refreshAccount()
  }

  function refreshAccount() {
    axios.get(getApi('/accounts'))
      .then(res => setAccounts(res.data))
      .catch(error => {
        alert("계좌 리스트를 불러오지 못 했습니다.")
        console.error(error)
      })
  }

  if (!loading && cards === undefined) {
    setLoading(true)
    axios.get(getApi('/cards'))
      .then(result => {
        const cards = result.data as ICard[]
        setCards(cards)
      }).catch(error => {
        alert("카드 목록을 불러오지 못했습니다.")
        console.error(error)
      })
      .finally(() => setLoading(false))
  }

  const applicateCard = () => {
    setLoading(true)
    axios.post(getApi('/cards'), {
      account_id: connectedAccount,
      type: cardType
    }).then(result => {
      setCards(result.data)
    }).catch(error => {
      alert("새 카드를 발급하지 못했습니다.")
      console.error(error)
    }).finally(() => setLoading(false))
  }

  const updateLimit = (card: ICard, limit: number) => {
    setLoading(true)
    axios.put(getApi(`/cards/${card.card_id}`), { limit })
      .then(result => setCards(result.data))
      .catch(error => {
        alert("카드 한도를 설정하지 못 하였습니다.")
        console.error(error)
      }).finally(() => setLoading(false))
  }

  const toggleCard = (card: ICard) => {
    setLoading(true)
    axios.put(getApi(`/cards/${card.card_id}/${card.dropped_at ? 'resume' : 'pause'}`), {})
      .then(result => setCards(result.data))
      .catch(error => {
        alert(`카드를 ${card.dropped_at ? '재개' : '정지'}하지 못 하였습니다.`)
        console.error(error)
      }).finally(() => setLoading(false))
  }

  return (
    <Dashboard title="사용자 정보">
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
        {cards === undefined ? <CircularProgress /> : cards.length === 0 ?
          <>
            <Typography component="h1" variant="h5">발급된 카드가 없습니다.</Typography>
            <Typography>첫 카드를 신청해보세요!</Typography>
            <br />
          </> : cards.map(card => <CardView
            key={card.card_id}
            card={card}
            updateLimit={updateLimit}
            toggleCard={toggleCard} />)}

        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ display: 'flex', gap: 1 }}>
            <FormControl>
              <InputLabel id="card_type_label">카드 종류</InputLabel>
              <Select
                id="card_type"
                labelId="card_type_label"
                value={cardType}
                onChange={(event) => {
                  setCardType(parseInt(event.target.value.toString()))
                }}>
                <MenuItem value={0}>신용 카드</MenuItem>
                <MenuItem value={1}>직불 카드</MenuItem>
              </Select>
            </FormControl>
            {accounts === undefined ? <Typography>새로고침 해주세요</Typography> :
              <FormControl>
                <InputLabel id="connected_account_label">연결할 계좌</InputLabel>
                <Select
                  id="connected_account"
                  labelId="connected_account_label"
                  value={connectedAccount}
                  onChange={(event) => {
                    setConnectedAccount(parseInt(event.target.value.toString()))
                  }}>
                  <MenuItem value={0}>계좌를 선택해주세요</MenuItem>
                  {accounts.filter(a => a.account_type !== 1).map(account => {
                    let type: string
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
                    return (<MenuItem value={account.account_id} key={account.account_id}>
                      <span>[{type}]</span>&nbsp;
                      {account.account_id}
                    </MenuItem>)
                  })}
                </Select>
              </FormControl>
            }
            <Button
              variant="contained"
              onClick={refreshAccount}>
              <Refresh />
            </Button>
            <Button
              variant="contained"
              disabled={!accounts || accounts.length === 0 || !connectedAccount}
              onClick={applicateCard}>
              카드 신청하기
            </Button>
          </CardContent>
        </Card>
      </Box>
      <LoadingScreen open={loading} />
    </Dashboard >
  )
}