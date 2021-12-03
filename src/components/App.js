import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Web3 from 'web3'
import './App.css';
import Token from '../abis/Token.json';
import dBank from '../abis/Pool.json';
import NftToken from '../abis/NftToken.json';
import hp from '../HelpPool.png';
import { NftGallery } from 'react-nft-gallery';


const CARD_ARRAY = [
  {
    name: 'fries',
    img: 'images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: 'images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: 'images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: 'images/pizza.png'
  },
  {
    name: 'milkshake',
    img: 'images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: 'images/hotdog.png'
  },
  {
    name: 'fries',
    img: 'images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: 'images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: 'images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: 'images/pizza.png'
  },
  {
    name: 'milkshake',
    img: 'images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: 'images/hotdog.png'
  }
]


class App extends Component {

    async componentWillMount(){
      await this.loadWeb3()
      await this.loadBlockchainData()
      this.setState({cardArray : CARD_ARRAY.sort(() => 0.5 - Math.random())})
    }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert('Non-Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    const balance = await web3.eth.getBalance(accounts[0])
    this.setState({account : accounts[0], balance , web3})

    const networkId = await web3.eth.net.getId()
    const networkData = NftToken.networks[networkId]
    if(networkData){
      const nftToken = new web3.eth.Contract(NftToken.abi, NftToken.networks[networkId].address)
      const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
      const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[networkId].address)
      const dBankAddress = dBank.networks[networkId].address;
      this.setState({nftToken, token, dbank,dBankAddress})
      // const totalSupply = await nftToken.methods.totalSupply().call()
      // this.setState({totalSupply : totalSupply})

      let balanceOf = await nftToken.methods.balanceOf(accounts[0]).call()
      for(let i = 0; i < balanceOf; i++){
        let id = await nftToken.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await nftToken.methods.tokenURI(id).call()
        console.log(tokenURI)
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    }else {
      window.alert('Smart Contract is not deployed to network')
    }
  }

  async deposit(amount) {
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
        .on('transactionHash', (hash) => {
          alert('Thanks For Helping,Now You Can Try Your Luck')
          this.setState({
            played : false
          })
        })
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }

  async withdraw(e) {
    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      } catch(e) {
        console.log('Error, withdraw: ', e)
      }
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(this.state.cardsWon.includes(cardId)){
      return 'https://github.com/Havoc19/HelpPool/tree/gh-pages' + '/images/white.png'
    }
    else if(this.state.cardsChosenId.includes(cardId)){
      return CARD_ARRAY[cardId].img
    } else {
    return "https://github.com/Havoc19/HelpPool/tree/gh-pages" + '/images/blank.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if(alreadyChosen === 1){
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId === optionTwoId){
      alert('You have clicked the same image!')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('You found a match')
      this.state.nftToken.methods.mint(
        this.state.account,
        CARD_ARRAY[optionOneId].img.toString()
      ).send({from : this.state.account})
      .on('transactionHash', (hash) => {
        this.setState({
          cardsWon: [...this.state.cardsWon,optionOneId,optionTwoId],
          tokenURIs : [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img],
          //played : true
      })
      })
    }else {
      alert('Better Luck Next Time, Thanks For Playing')
      //this.setState({played : true})
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: ' ',
      nftToken: null,
      token: null,
      dbank: null,
      dBankAddress : null,
      balance: 0,
      totalSupply : 0,
      played : true,
      tokenURIs : [],
      cardArray : [],
      cardsChosen : [],
      cardsChosenId : [],
      cardsWon : [],
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={hp} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; HelpPool
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <h1 className="d-4">Welcome!</h1>
              <h3>Help To Earn Platform</h3>
                <br></br>
              <h6 className="top">Deposit and get a chance to play nft game</h6>
              <br></br>
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit">
                  <div>
                  <br></br>
                    How much do you want to deposit?
                    <br></br>
                    (min. amount is 0.01 ETH)
                    <br></br>
                    (You can only deposit once)
                    <br></br>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      let amount = this.depositAmount.value
                      amount = amount * 10**18 //convert to wei
                      this.deposit(amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                          id='depositAmount'
                          step="0.01"
                          type='number'
                          ref={(input) => { this.depositAmount = input }}
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required />
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>

                  </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <br></br>
                    Do you want to withdraw + take interest?
                    <br></br>
                    <br></br>
                  <div>
                    <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
          <br></br>
          <br></br>
          <div>
            {(this.state.played === false)? 
             <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto styling">
                <h5 className="d-4" >Try Your Luck!</h5>
                <h6>{this.state.account}</h6>
                <div className="grid mb-4" >

                  {this.state.cardArray.map((card, key) => {
                    return(
                      <img
                      key={key}
                      src = {this.chooseImage(key)}
                      data-id={key}
                      onClick={(event) => {
                        let cardId = event.target.getAttribute('data-id')
                        if(!this.state.cardsWon.includes(cardId.toString())){
                          this.flipCard(cardId)
                        }
                      }}
                      />
                    )
                  })}

                </div>
                <div>
        
                </div>

              </div>

            </main>
          </div>
             : null}
          </div>
          <div>
                <h5>Tokens Collected:<span id="result">&nbsp;{this.state.tokenURIs.length}</span></h5>
                  <div className="grid mb-4" >
                  { this.state.tokenURIs.map((tokenURI, key) => {
                      {/* return(
                        <img
                          key={key}
                          src={tokenURI}
                        />
                      ) */}
                      {console.log(key, tokenURI)}
                    })}
                    {/* {console.log(this.state.tokenURIs)} */}
                  </div>
                  {/* <NftGallery ownerAddress/> */}
            </div>
        </div>
        <div className="first">
        <div>
          <h2>What is HelpPool?</h2>
          <ul>
          <li>
          <p>HelpPool is blockchain based "Help To Earn" platform.It consists of pools where holders can deposit their crypto in pool for month.</p>
          </li>
          <li>
          <p>Interest earned in that pool will be used to help non-profit organiztion registered with us.</p>
          </li>
          <li>
          <p>Each depositer will get chance to play a nft game and will receive assured reward while withdrawal</p>
          </li>
          </ul>
        </div>
        <div>
          <h2>Why I should Participate In Help Pool?</h2>
          <ol>
            <li>
                <p>You will help others needy poeple with your crypto without loosing any fund + earning an extra income</p>
            </li>
            <li>
                <p>You will get chance to play a game of matching nft, if you win will get an nft for free</p>
            </li>
            <li>
                <p>After 1 month during withdrawal you will receive our native token as a reward + your deposited amount</p>
            </li>
          </ol>
        </div>
        <div>
          <h2>What Happens To My Crypto?</h2>
          <ul>
          <li>
            <p>Whenever you deposit your crypto,it's get locked for 1 month in a pool ,where many kind hearted like you have participated</p>
          </li>
          <li>
            <p>90% of interest earned on that pool in a month are distributed to registered non-profit organization and 10% is used for growth of our company</p>
          </li>
          <li>
            <p>Your crypto will be able for withdrawal after 1 month + assured rewards</p>
          </li>
          </ul>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
