import styled from 'styled-components'
import { View, FlatList, ActivityIndicator } from 'react-native'
import Lottie from 'lottie-react-native'

export const Container = styled(View)`
  
`

export const ListApps = styled(FlatList)`
  
`

export const LoadingIcon = styled(Lottie)`
  width: 120px;
  height: 120px;
  margin-top: 50%;
`

export const Loading = styled(ActivityIndicator).attrs({
  color: '#27BEE8',
  size: 'small'
})`
  margin: 30px 0;
`