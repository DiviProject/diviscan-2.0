import Header from '../components/Header'
import LatestBlocks from '../components/LatestBlocks'
import fetch from 'isomorphic-unfetch'
import Link from 'next/link'

const Home = props => (
  <div>
    <Header />
    <h1>Diviscan 2.0</h1>
    <ul>
      <li>Version: {props.info.version}</li>
      <li>Blocks: {props.info.blocks}</li>
      <li>Current supply: {props.info.moneysupply.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
      <li>Difficulty: {props.info.difficulty}</li>
    </ul>
    <LatestBlocks blocks = {props.blocks} />
  </div>
)

Home.getInitialProps = async function() {
  const info = await fetch('https://api.diviscan.io/info')
  const data = await info.json()
  const blocks = await fetch('https://api.diviscan.io/latest-blocks')
  const blockdata = await blocks.json()
  return {
    info: data.result,
    blocks: blockdata
  }
}

export default Home