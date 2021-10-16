import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, View, ScrollView, Image, SafeAreaView } from 'react-native'
import heroku from './apis/heroku'
import { Svg, Path, Rect } from 'react-native-svg'
import { StatusBar } from 'expo-status-bar'
import Lottie from 'lottie-react-native'

export default function App() {
  const [apps, setApps] = useState([{
    id: '',
    nome: '',
    build: {
      pending: false
    }
  }])
  const [appsLoading, setAppsLoading] = useState(false)
  async function appsGet() {
    const appsBrutos = await (await heroku.get('/apps')).data
    let appsParaColocar = []
    appsBrutos.map(async app => {
      const id = app.id
      
      appsParaColocar.push({
        id: id,
        nome: app.name,
        build: {
          pending: false
        }
      })
    })
    
    return await appsParaColocar
  }

  useEffect(() => {
    appsGet().then(apps => {
      setApps(apps)
      setAppsLoading(true)
    })
  }, [])

  const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: #ffffff;
    align-items: center;
    justify-content: center;
    padding-bottom: 25%;
  `

  const LoadingIcon = styled(Lottie)`
    width: 120px;
    height: 120px;
    margin-top: 50%;
  `

  function CardApp({ children='', check=true, host='' }) {
    const [build, setBuild] = useState()
    const [loadingBuild, setLoadingBuild] = useState(false)
    async function BuildsGet(app) {
      const builds = await (await heroku.get(`/apps/${app}/builds`)).data
      const pendingsBrutos = Promise.all(
        builds.map(build => {
          if (build.status === 'pending') {
            return 'pending'
          } else {
            return 'sucess'
          }
        })
      )
      const pending = !(await pendingsBrutos).includes('pending') ? true : false
      
      setBuild(pending)
      setLoadingBuild(true)
    }

    useEffect(() => {
      BuildsGet(children)
    }, [])
    const Card = styled(View)`
      background-color: #27BEE8;
      padding: 7%;
      border-radius: 20px;
      margin-top: 10%;
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    `

    const Header = styled(View)`
      flex-direction: row;
    `

    const LogoHeroku = styled(Image)`
      width: 30px;
      height: 30px;
    `

    const Title = styled(Text)`
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      width: 100%;
      margin-left: 5%;
    `

    const Infos = styled(View)`
      flex-direction: row;
      align-items: center;
      margin-top: 7%;
      ${() => !loadingBuild &&'margin-bottom: 18%;'};
    `

    const IconCheck = styled(Svg)`
      width: 40px;
      height: 40px;
    `

    const IconBuild = styled(Svg)`
      width: 40px;
      height: 40px;
    `

    const BuildText = styled(Text)`
      color: #ffffff;
      background-color: #F2AE30;
      font-size: 19px;
      margin-left: 5%;
      padding-left: 5%;
      padding-right: 5%;
      padding-top: 3.5%;
      padding-bottom: 3.5%;
      border-radius: 30px;
    `

    const SuccessText = styled(Text)`
      color: #ffffff;
      background-color: #29A678;
      font-size: 19px;
      margin-left: 5%;
      padding-left: 5%;
      padding-right: 5%;
      padding-top: 3.5%;
      padding-bottom: 3.5%;
      border-radius: 30px;
    `

    const LoadingIconCard = styled(Lottie)`
      width: 80px;
      height: 80px;
      padding-left: 20%;
    `

    return (
      <Card>
        <Header>
          {host==='heroku' && <LogoHeroku source={require('./assets/heroku.png')}/>}
          <Title>{children}</Title>
        </Header>
        <Infos>
          {loadingBuild && (
            <>
              {build ? <>
                <IconCheck xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="#29A678"><Rect fill="none" height="24" width="24"/><Path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M19.79,10.22C19.92,10.79,20,11.39,20,12 c0,4.42-3.58,8-8,8s-8-3.58-8-8c0-4.42,3.58-8,8-8c1.58,0,3.04,0.46,4.28,1.25l1.44-1.44C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12 c0,5.52,4.48,10,10,10s10-4.48,10-10c0-1.19-0.22-2.33-0.6-3.39L19.79,10.22z"/></IconCheck>
                <SuccessText>Success</SuccessText>
              </> : <>
                <IconBuild xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F2AE30"><Path clip-rule="evenodd" d="M0 0h24v24H0z" fill="none"/><Path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></IconBuild>
                <BuildText>Building</BuildText>
              </>}
            </>
          )}
          {!loadingBuild && <LoadingIconCard autoPlay={true} source={require('./animations/loadingWhite.json')}/>}
        </Infos>
      </Card>
    )
  }
  
  return (
    <ScrollView style={{flex: 5, backgroundColor: '#ffffff', padding: 20}}>
      <Container>
        {appsLoading && apps.map((app, index) => <CardApp host="heroku" key={index} check={app.build.pending ? false : true}>{app.nome}</CardApp>)}
        {!appsLoading && <LoadingIcon autoPlay={true} source={require('./animations/loading.json')}/>}
        <StatusBar style="light"/>
      </Container>
    </ScrollView>
  )
}