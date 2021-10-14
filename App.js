import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, View, ScrollView, Image } from 'react-native'
import heroku from './apis/heroku'
import { Svg, Path, Rect } from 'react-native-svg'
import { StatusBar } from 'expo-status-bar'

const Container = styled(View)`
  flex: 1;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  padding-bottom: 25%;
`

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
    let appsParaColocarCertas = Promise.all(
      appsParaColocar.map(async app => {
        const builds = await (await heroku.get(`/apps/${app.id}/builds`)).data
        const pendingsBrutos = Promise.all(
          builds.map(build => {
            if (build.status === 'pending') {
              return 'pending'
            } else {
              return 'sucess'
            }
          })
        )
        const pending = (await pendingsBrutos).includes('pending') ? true : false
        app.build.pending = pending

        return app
      })
    )
      
    return await appsParaColocarCertas
  }
  useEffect(() => {
    appsGet().then(apps => {
      setApps(apps)
      setAppsLoading(true)
    })
  }, [])

  function CardApp({ children='', check=true }) {
    const Card = styled(View)`
      background-color: #0D2CD9;
      padding: 7%;
      border-radius: 20px;
      margin-top: 10%;
      width: 85%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
    `

    const Title = styled(Text)`
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      width: 100%;
      margin-left: 7%;
    `

    const IconBuild = styled(Svg)`
      width: 100%;
      padding: 0;
      margin: 0;
      right: 290%;
      top: 10%;
      padding-top: 30%;
      padding-bottom: 10%;
    `

    const IconBuildText = styled(Text)`
      right: 265%;
      margin-top: 25%;
      color: #ffffff;
      font-size: 17px;
    `

    const IconCheck = styled(Svg)`
      width: 100%;
      padding: 0;
      margin: 0;
      right: 295%;
      top: 10%;
      padding-top: 20%;
      padding-bottom: 20%;
    `

    const LogoHeroku = styled(Image)`
      width: 30px;
      height: 30px;
    `

    return (
      <Card>
        <LogoHeroku source={require('./assets/heroku.png')}/>
        <Title>{children}</Title>
        {check ? <IconCheck xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="32px" viewBox="0 0 24 24" width="32px" fill="#29A678"><Rect fill="none" height="24" width="24"/><Path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M19.79,10.22C19.92,10.79,20,11.39,20,12 c0,4.42-3.58,8-8,8s-8-3.58-8-8c0-4.42,3.58-8,8-8c1.58,0,3.04,0.46,4.28,1.25l1.44-1.44C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12 c0,5.52,4.48,10,10,10s10-4.48,10-10c0-1.19-0.22-2.33-0.6-3.39L19.79,10.22z"/></IconCheck> : <>
          <IconBuild xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px" fill="#F2AE30"><Path d="M0 0h24v24H0V0z" fill="none"/><Path d="M22.61 18.99l-9.08-9.08c.93-2.34.45-5.1-1.44-7C9.79.61 6.21.4 3.66 2.26L7.5 6.11 6.08 7.52 2.25 3.69C.39 6.23.6 9.82 2.9 12.11c1.86 1.86 4.57 2.35 6.89 1.48l9.11 9.11c.39.39 1.02.39 1.41 0l2.3-2.3c.4-.38.4-1.01 0-1.41zm-3 1.6l-9.46-9.46c-.61.45-1.29.72-2 .82-1.36.2-2.79-.21-3.83-1.25C3.37 9.76 2.93 8.5 3 7.26l3.09 3.09 4.24-4.24-3.09-3.09c1.24-.07 2.49.37 3.44 1.31 1.08 1.08 1.49 2.57 1.24 3.96-.12.71-.42 1.37-.88 1.96l9.45 9.45-.88.89z"/></IconBuild>
          <IconBuildText>Build...</IconBuildText>
        </>}
      </Card>
    )
  }
  
  return (
    <ScrollView style={{flex: 5, backgroundColor: '#ffffff', padding: 20}}>
      <Container>
        <Text>{appsLoading && apps[0].nome}</Text>
        {appsLoading && apps.map((app, index) => <CardApp key={index} check={app.build.pending ? false : true}>{app.nome}</CardApp>)}
        <CardApp key={10} check={false}>Teste Build</CardApp>
        <StatusBar style="light" />
      </Container>
    </ScrollView>
  )
}