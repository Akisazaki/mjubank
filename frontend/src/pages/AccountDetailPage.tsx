import { Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import { useState } from "react";
import { useParams } from 'react-router';
import { Dashboard } from "../components/Dashboard";
import { LoadingScreen } from "../components/LoadingScreen";
import { Account } from '../model/entity/account';
import { Customer } from '../model/entity/customer';
import { Transaction } from '../model/entity/transaction';
import { getApi } from '../utils/Config';

interface AccountCardProps {
  account: Account
  onDeposit: (amount: number, note: string) => void
  onTransfer: (amount: number, target: number, note: string) => void
  onWithdraw: (amount: number, note: string) => void
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
  const [amount, setAmount] = useState(0)
  const [transferTarget, setTransferTarget] = useState(0)
  const [dialogType, setDialogType] = useState(0)
  const [note, setNote] = useState('')
  const handleClose = () => setDialogType(0)
  const fullScreen = window.screen.width < 600
  const amountChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.currentTarget.valueAsNumber
    if (!isNaN(number))
      setAmount(number)
  }
  const transferTargetChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.currentTarget.valueAsNumber
    if (!isNaN(number))
      setTransferTarget(number)
    setTransferInfo(undefined)
  }
  const noteChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.currentTarget.value)
  }
  const openDialog = (type: number) => {
    if (type !== 0) {
      setAmount(0)
      setNote('')
    }
    setDialogType(type)
  }
  const [transferInfo, setTransferInfo] = useState<Customer | undefined>(undefined)

  function checkAccount() {
    axios.get(getApi(`/accounts/${transferTarget}/holder`))
      .then(holder => setTransferInfo(holder.data))
      .catch(error => {
        alert("계좌를 확인할 수 없습니다.\n계좌번호를 다시 확인하여주세요.")
        console.error(error)
      })
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">{type}</Typography>
          <Typography variant="h5">계좌번호: {account.account_id}</Typography>
          <Typography>개설일: {moment(account.created_at).format('LL HH:mm')}</Typography>
          <Typography variant="h4">&#8361; {account.balance}</Typography>
        </CardContent>
        <CardContent>
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={() => openDialog(1)}>
              입금하기
          </Button>
            <Button
              disabled={account.account_type === 1}
              variant="contained"
              onClick={() => openDialog(2)}>
              출금하기
          </Button>
            <Button
              disabled={account.account_type === 1}
              variant="contained"
              onClick={() => openDialog(3)}>
              송금하기
          </Button>
          </Box>
        </CardContent>
      </Card>
      <Dialog
        fullScreen={fullScreen}
        open={dialogType === 1}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          입금하기
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            입금할 금액을 알려주세요.
          </DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            name="depositAmount"
            label="입금할 양"
            type="number"
            id="depositAmount"
            onChange={amountChanged}
            value={amount}
          />
          <TextField
            margin="normal"
            fullWidth
            name="depositNote"
            label="메모"
            type="text"
            inputProps={{ maxLength: 64 }}
            id="depositNote"
            onChange={noteChanged}
            value={note}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={amount <= 0}
            autoFocus
            onClick={() => {
              handleClose()
              props.onDeposit(amount, note)
            }}>
            입금
          </Button>
          <Button autoFocus onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={dialogType === 2}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          출금하기
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            출금할 금액을 알려주세요.
          </DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            name="withdrawAmount"
            label="출금할 양"
            type="number"
            id="withdrawAmount"
            onChange={amountChanged}
            value={amount}
          />
          <TextField
            margin="normal"
            fullWidth
            name="withdrawNote"
            label="메모"
            type="text"
            inputProps={{ maxLength: 64 }}
            id="withdrawNote"
            onChange={noteChanged}
            value={note}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={amount <= 0 || amount > account.balance}
            autoFocus
            onClick={() => {
              handleClose()
              props.onWithdraw(amount, note)
            }}>
            출금
          </Button>
          <Button autoFocus onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={dialogType === 3}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          송금하기
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            송금 받을 계좌와 금액을 알려주세요.
          </DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            name="transferTarget"
            label="송금받을 계좌"
            type="number"
            id="transferTarget"
            onChange={transferTargetChanged}
            value={transferTarget}
          />
          <Typography>{transferInfo === undefined ? "계좌를 확인해주세요." : "계좌 소유주: " + transferInfo.name}</Typography>
          <Button onClick={checkAccount}>계좌 확인하기</Button>
          <TextField
            margin="normal"
            required
            fullWidth
            name="transferAmount"
            label="송금할 양"
            type="number"
            id="transferAmount"
            onChange={amountChanged}
            value={amount}
          />
          <TextField
            margin="normal"
            fullWidth
            name="transferNote"
            label="메모"
            type="text"
            inputProps={{ maxLength: 64 }}
            id="transferNote"
            onChange={noteChanged}
            value={note}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={amount <= 0 || amount > account.balance || transferInfo === undefined}
            autoFocus
            onClick={() => {
              handleClose()
              props.onTransfer(amount, transferTarget, note)
            }} >
            송금
          </Button>
          <Button autoFocus onClick={handleClose}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function getTransactionType(transaction: Transaction) {
  switch (transaction.transaction_type) {
    case 1:
      return "출금"
    case 2:
      return "송금"
    case 3:
      return "카드결재"
    case 4:
      return "입금"
    default:
      return "입금"
  }
}

interface TransactionCardProps {
  transaction: Transaction
}

function TransactionCard(props: TransactionCardProps) {
  const { transaction } = props
  let type = getTransactionType(transaction)
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{type}</Typography>
        <Typography>발생일: {transaction.transaction_date.toLocaleString()}</Typography>
        {transaction.counter_party_account &&
          <Typography>상대 계좌: {transaction.counter_party_account}</Typography>
        }
        <Typography variant="h4">&#8361; {transaction.amount}</Typography>
        <Typography>잔고: &#8361; {transaction.balance_after}</Typography>
        <Typography>메모: {transaction.note}</Typography>
      </CardContent>
    </Card>
  )
}

interface AccountDetailData {
  account: Account
  transactions: Transaction[]
}

export function AccountDetailPage() {

  const { id } = useParams();

  const [loading, setLoading] = useState(false)
  // const auth = useContext(AuthContext)

  const [data, setData] = useState<AccountDetailData | undefined>(undefined)


  function refresh() {
    setLoading(true)
    axios.get(getApi('/transaction/' + id))
      .then(result => {
        const account = result.data.account as Account
        const transactions = result.data.transactions as Transaction[]
        console.log(account)
        console.log(transactions)
        setData({ account, transactions })
      }).catch(error => {
        alert("계정 정보를 불러오지 못했습니다.")
        console.error(error)
      })
      .finally(() => setLoading(false))
  }

  if (!loading && data === undefined) {
    refresh()
  }

  function onDeposit(amount: number, note: string) {
    setLoading(true)
    axios.post(getApi(`/accounts/${id}/deposit`), {
      amount: amount,
      note: note
    }).then(_ => {
      refresh()
    }).catch(error => {
      setLoading(false)
      alert("입금을 하지 못했습니다.")
      console.error(error)
    })
  }

  function onWithdraw(amount: number, note: string) {
    setLoading(true)
    axios.post(getApi(`/accounts/${id}/withdraw`), {
      amount: amount,
      note: note
    }).then(_ => {
      refresh()
    }).catch(error => {
      setLoading(false)
      alert("출금을 하지 못했습니다.")
      console.error(error)
    })
  }

  function onTransfer(amount: number, target: number, note: string) {
    setLoading(true)
    axios.post(getApi(`/accounts/${id}/transfer`), {
      counterParty: target,
      amount: amount,
      note: note
    }).then(_ => {
      refresh()
    }).catch(error => {
      setLoading(false)
      alert("송금을 하지 못했습니다.")
      console.error(error)
    })
  }

  if (data) {
    const { account, transactions } = data!
    const columns: GridColDef[] = [
      { field: 'transaction_date', headerName: 'Date', width: 150 },
      { field: 'transaction_type', headerName: 'Type', width: 90 },
      { field: 'account_id', headerName: 'Account', width: 125 },
      { field: 'counter_party_account', headerName: 'Counter party', width: 125 },
      { field: 'balance_after', headerName: 'Balance after', type: 'number', width: 170 },
      { field: 'note', headerName: 'Note', width: 270 },
    ]
    return (
      <Dashboard title="계좌 정보">
        <AccountCard account={account}
          onDeposit={onDeposit}
          onWithdraw={onWithdraw}
          onTransfer={onTransfer} />
        {/* <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
          <Typography variant='h3'>거래내역</Typography>
          {transactions.length > 0 ?
            transactions.map(item => <TransactionCard transaction={item} key={item.serial_number} />) :
            <Typography>거래내역이 없습니다.</Typography>}
        </Box> */}
        {transactions.length === 0 ?
          <Typography>거래내역이 없습니다.</Typography>
          : <DataGrid
            rows={transactions.map(item => {
              return {
                ...item,
                id: item.serial_number,
                transaction_date: moment(item.transaction_date).format('YYYY-MM-DD HH:mm'),
                transaction_type: getTransactionType(item)
              }
            })}
            columns={columns}
            pageSize={100}
            rowsPerPageOptions={[10]}
            style={
              {
                marginTop: '20px',
                height: '800px'
              }
            }
          />
        }
        <Button onClick={refresh}>새로고침</Button>
        <LoadingScreen open={loading} />
      </Dashboard >
    )
  }
  else
    return (
      <Dashboard title="계좌 정보">
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 1 }}>
          <Typography>정보를 불러오는 중입니다.</Typography>
        </Box>
        <LoadingScreen open={loading} />
      </Dashboard >
    )
}