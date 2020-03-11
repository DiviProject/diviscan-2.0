import Router from 'next/router'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

export default class Search extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: ''
        }
    }

    inputChange() {
        this.setState({ data: this.search.value })
    }

    onKeyDown(event) {
        if (event.key === 'Enter'){
            this.submitForm()
        }
    }

    submitForm = async (data) => {
        data = this.state.data
        if (data.length == 34) {
            Router.push('/address?address=' + data)
        } else if (data.length === 64) {
            const check = await fetch('https://api.diviscan.io/tx/' + data)
            const result = await check.json()
            if (result.error) {
                Router.push('/block?block=' + data)
            } else {
                Router.push('/tx?tx=' + data)
            }
        } else {
            Router.push('/block?blockheight=' + data)
        }
    }   

    render() {
        return(
            <div>
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Enter block height, hash, address, or txid"
                    ref={input => this.search = input}
                    onChange={this.inputChange.bind(this)}
                    onKeyUp={this.onKeyDown.bind(this)}
                >
                </input>
                <input type="submit" value="SEARCH" onClick={this.submitForm}/>
            </div>
        )
    }
}

