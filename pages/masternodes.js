import Header from '../components/Header'
import Link from 'next/link' 

const Masternodes = props => (
    <div>
        <Header />
        <div>
            <h1>Masternodes</h1>
            <p>Number of masternodes: {props.info.num_masternodes}</p>
            <h3>Tiers</h3>
            <ul>
                <li>Copper: {props.info.layers.copper}</li>
                <li>Silver: {props.info.layers.silver}</li>
                <li>Gold: {props.info.layers.gold}</li>
                <li>Platinum: {props.info.layers.platinum}</li>
                <li>Diamond: {props.info.layers.diamond}</li>
            </ul>
        </div>
    </div>
)

Masternodes.getInitialProps = async function() {
    const res = await fetch('https://api.diviscan.io/masternodes')
    const data = await res.json()
    return {
        info: data
    }
}
 
export default Masternodes