import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, View } from 'react-native'
import heroku from './heroku'

const Container = styled(View)`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`

const Title = styled(Text)`
  color: #000;
  text-align: center;
  font-size: 16px;
`

export default function App() {
  const [apps, setApps] = useState([{
    id: '',
    nome: '',
    build: {
      pending: false
    }
  }])
  useEffect(() => {
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
      setApps(await appsParaColocarCertas)
      if (apps.length >= 1) {
        apps.map(app => {
          console.log(app)
        })
      }
    }
    appsGet().then(resu => {
      
    })
  }, [apps])

  return (
    <Container>
      <Title onPress={async () => {
        
      }}>Hello</Title>
    </Container>
  )
}