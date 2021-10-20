import styled from 'styled-components'
import { View, Image, Text, ActivityIndicator } from 'react-native'
import Lottie from 'lottie-react-native'

export const Container = styled(View)`
    background-color: ${props => {
        if (props.host === 'heroku') {
            return '#9D81C3;'
        } else {
            return ''
        }
    }};
    padding: 7%;
    border-radius: 20px;
    margin-top: 10%;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-self: center;
    ${props => props.ult ? 'margin-bottom: 10%;' : ''};
`

export const Header = styled(View)`
    flex-direction: row;
`

export const LogoHeroku = styled(Image)`
    width: 30px;
    height: 30px;
`

export const Title = styled(Text)`
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    margin-left: 5%;
`

export const Infos = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-top: 7%;
`

export const IconCheck = styled(Lottie)`
    width: 50px;
    height: 50px;
`

export const SuccessText = styled(Text)`
    color: #ffffff;
    background-color: #29A678;
    font-size: 19px;
    margin-left: 5%;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 3.5%;
    padding-bottom: 3.5%;
    border-radius: 30px;
    font-weight: bold;
`

export const IconBuild = styled(Lottie)`
    width: 70px;
    height: 70px;
`

export const BuildText = styled(Text)`
    color: #ffffff;
    background-color: #F2AE30;
    font-size: 19px;
    margin-left: 5%;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 3.5%;
    padding-bottom: 3.5%;
    border-radius: 30px;
    font-weight: bold;
`

export const Loading = styled(ActivityIndicator).attrs({
    color: '#ffffff',
    size: 'small'
  })`
    margin: 30px 0;
`