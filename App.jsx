import React, { useEffect, useState } from 'react'
import { Container, ListApps, Loading } from './styles/app'
import heroku from './apis/heroku'
import vercel from './apis/vercel'
import { StatusBar } from 'expo-status-bar'
import CardApp from './components/CardApp'

export default function App() {
  const [appsHeroku, setAppsHeroku] = useState([{
    id: '',
    nome: '',
    build: {
      pending: false
    },
    host: ''
  }])
  const [appsVercel, setAppsVercel] = useState([{
    id: '',
    nome: '',
    build: {
      pending: false
    },
    host: ''
  }])
  async function appsGetHeroku() {
    const appsBrutos = await (await heroku.get('/apps')).data
    let appsParaColocar = []
    appsBrutos.map(async app => {
      const id = app.id
      
      appsParaColocar.push({
        id: id,
        nome: app.name,
        build: {
          pending: false
        },
        host: 'heroku'
      })
    })
    
    return appsParaColocar
  }
  async function appsGetVercel() {
    const appsBrutos = await (await vercel.get('/v8/projects')).data
    let appsParaColocar = []

    appsBrutos.projects.map(projeto => {
      const build = projeto.latestDeployments.map(deploy => deploy.readyState === 'READY' ? 'false' :  'true')
      appsParaColocar.push({
        id: projeto.id,
        nome: projeto.name,
        build: {
          pending: build.includes('true')
        },
        host: 'vercel'
      })
    })
    
    return appsParaColocar
  }

  useEffect(() => {
    appsGetHeroku().then(apps => {
      setAppsHeroku(apps)
    })
    appsGetVercel().then(apps => {
      setAppsVercel(apps)
    })
  }, [])
  let apps = [...appsHeroku, ...appsVercel]
  console.log(appsVercel)
  return (
    <Container>
      <ListApps 
        data={apps}
        keyExtractor={app => String(app.id)}
        renderItem={({ index, item:app }) => (
          <CardApp key={index} ult={apps.length==index+1 ? true : false} host={app.host} appName={app.nome}/>
        )}
      />
      {appsHeroku.length ==0 ? <Loading/> : null}
      <StatusBar style="light"/>
    </Container>
  ) 
}