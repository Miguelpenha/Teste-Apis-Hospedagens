import React from 'react'
import heroku from '../../apis/heroku'
import { useEffect, useState } from 'react'
import { Container, Header, BuildText, IconBuild, IconCheck, Infos, LogoHeroku, SuccessText, Title, Loading } from './style'

export default function CardApp ({ host, appName, ult, buildpd }) {
  const [build, setBuild] = useState(buildpd)
  const [loadingBuild, setLoadingBuild] = useState(true)
  
  if (host == 'heroku') {
    async function BuildsGet(app) {
      try {
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
        
        const pending = (await pendingsBrutos).includes('pending') ? true : false
        
        setLoadingBuild(true)
        setBuild(pending)
      } catch {
        
      }
    }
    
    useEffect(() => {
      BuildsGet(appName)
    }, [])
  }
  
  if (appName) {
    return (
      <Container ult={ult} host={host}>
          <Header>
            {host==='heroku' && <LogoHeroku source={require('../../assets/heroku.png')}/>}
            <Title>{appName}</Title>
          </Header>
            {loadingBuild && (
              <Infos>
                {!build ? <>
                  <IconCheck autoPlay colorFilters={[
                    { keypath: 'circle-green', color: '#29A678' },
                    { keypath: 'check-green', color: '#29A678' }
                  ]} speed={1.2} loop={false} source={require('../../animations/check.json')}/>
                  <SuccessText>Success</SuccessText>
                </> : <>
                  {<IconBuild autoPlay={true} colorFilters={[
                    { keypath: 'boltCore', color: '#9D81C3' },
                    { keypath: 'headHole 2', color: '#9D81C3' },
                    { keypath: 'headHole', color: '#9D81C3' },
                    { keypath: 'boltCircle', color: '#9D81C3' },
                    { keypath: 'bg', color: '#9D81C3' }
                  ]} loop source={require('../../animations/build.json')}/>}
                  <BuildText>Building</BuildText>
                </>}
              </Infos>
            )}
            {!loadingBuild && <Loading/>}
        </Container>
    )
  } else {
    return null
  }
}