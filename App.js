import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, View, ScrollView, Image, SafeAreaView } from 'react-native'
import heroku from './apis/heroku'
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
    
    return appsParaColocar
  }

  useEffect(() => {
    appsGet().then(apps => {
      setApps(apps)
      setAppsLoading(true)
    })
  }, [])

  const Container = styled(SafeAreaView)`
    height: 100%;
    padding: 0;
    margin: 0;
    align-items: center;
    ${() => {
      if (appsLoading) {
        return 'padding-bottom: 10%;'
      } else {
        return 'padding-bottom: 40%;'
      }
    }}
  `

  const LoadingIcon = styled(Lottie)`
    width: 120px;
    height: 120px;
    margin-top: 50%;
  `

  function CardApp({ children='', host='' }) {
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

      setLoadingBuild(true)
      if (app != 'escola-pagamento') {
        setBuild(pending)
      }
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
    `

    const IconCheck = styled(Lottie)`
      width: 50px;
      height: 50px;
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

    const IconBuild = styled(Lottie)`
      width: 70px;
      height: 70px;
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

    const LoadingIconCard = styled(Lottie)`
      width: 67.5px;
      height: 67.5px;
      padding-left: 27%;
    `
    
    return (
      <Card>
        <Header>
          {host==='heroku' && <LogoHeroku source={require('./assets/heroku.png')}/>}
          <Title>{children}</Title>
        </Header>
          {loadingBuild && (
            <Infos>
              {!build ? <>
                <IconCheck autoPlay colorFilters={[
                  { keypath: 'circle-green', color: '#29A678' },
                  { keypath: 'check-green', color: '#29A678' }
                ]} speed={1.2} loop={false} source={require('./animations/check.json')}/>
                <SuccessText>Success</SuccessText>
              </> : <>
                <IconBuild autoPlay={true} colorFilters={[
                  { keypath: 'boltCore', color: '#27BEE8' },
                  { keypath: 'headHole 2', color: '#27BEE8' },
                  { keypath: 'headHole', color: '#27BEE8' },
                  { keypath: 'boltCircle', color: '#27BEE8' },
                  { keypath: 'bg', color: '#27BEE8' }
                ]} loop={false} source={require('./animations/build.json')}/>
                <BuildText>Building</BuildText>
              </>}
            </Infos>
          )}
        {!loadingBuild && <LoadingIconCard autoPlay={true} source={require('./animations/loadingWhite.json')}/>}
      </Card>
    )
  }
  
  return (
    <ScrollView style={{display: 'flex'}}>
      <Container>
        {appsLoading && apps.map((app, index) => <CardApp host="heroku" key={index}>{app.nome}</CardApp>)}
        {!appsLoading && <LoadingIcon autoPlay={true} source={require('./animations/loading.json')}/>}
        <StatusBar style="light"/>
      </Container>
    </ScrollView>
  )
}