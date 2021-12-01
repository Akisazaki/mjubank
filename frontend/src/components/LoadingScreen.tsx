import { Backdrop, BackdropProps, CircularProgress } from "@mui/material"

export const LoadingScreen = (props: BackdropProps) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      {...props}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}