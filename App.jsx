import React, { useEffect, useState } from 'react'
import { Container, LoadingIcon } from './styles/app'
import { ScrollView } from 'react-native'
import heroku from './apis/heroku'
import { StatusBar } from 'expo-status-bar'
import CardApp from './components/CardApp'

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
  
  return (
    <ScrollView style={{display: 'flex'}}>
      <Container appsLoading={appsLoading}>
        {appsLoading && apps.map((app, index) => <CardApp key={index} host="heroku" appName={app.nome}/>)}
        {!appsLoading && <LoadingIcon autoPlay={true} source={require('./animations/loading.json')}/>}
        <StatusBar style="light"/>
      </Container>
    </ScrollView>
  ) 
}