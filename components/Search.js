import Router from 'next/router'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'

function fetcher(url) {
    return fetch(url).then(r => r.json())
}

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
            this.handleSubmit()
        }
    }

    submitForm = (data) => {
        data = this.state.data
        Router.push('/address?address=' + data)
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

