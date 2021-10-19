import styled from 'styled-components'
import { SafeAreaView } from 'react-native'
import Lottie from 'lottie-react-native'

export const Container = styled(SafeAreaView)`
  height: 100%;
  padding: 0;
  margin: 0;
  align-items: center;
  padding-bottom: ${props => props.appsLoading ? '10%' : '40%'};
`

export const LoadingIcon = styled(Lottie)`
    width: 120px;
    height: 120px;
    margin-top: 50%;
`