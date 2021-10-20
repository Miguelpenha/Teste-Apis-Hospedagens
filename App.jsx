import React, { useEffect, useState } from 'react'
import { Container, ListApps, Loading } from './styles/app'
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
    })
  }, [])
  
  return (
    <Container>
      <ListApps 
        data={apps}
        keyExtractor={app => String(app.id)}
        renderItem={({ index, item:app }) => (
          <CardApp key={index} ult={apps.length==index+1 ? true : false} host="heroku" appName={app.nome}/>
        )}
      />
      {apps.length ==0 ? <Loading/> : null}
      <StatusBar style="light"/>
    </Container>
  ) 
}