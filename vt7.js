//Luodaan komponentti joka renderöidään sivulle
var MyComponent = React.createClass({
    //Alustetaan 
    getInitialState: function(){
	    return { resepti:[], ruokalaji:[], aineet:[], liittyy:[], jarkka:1 };
	},
  //Haetaan ajaxilla tiedot
	componentDidMount: function(){
            $.ajax({
                    async: true,
		            url: "reseptit.json",
                    dataType: 'json',
                    success: function(data){
			            this.setState({resepti:data.reseptit, ruokalaji:data.ruokalajit, aineet:data.aineet, liittyy:data.liittyy});
                    }.bind(this),
                    error: ajaxVirhe
                });
	},
    // Vaihdetaan tieto listauksen suunnasta
    kaanna: function() {
        var vaihda = this.state.jarkka *-1;
        this.setState({jarkka:vaihda});
    },
    // Järjestetään reseptit
    jarjesta: function(jarj){
        this.state.resepti.sort(function(a, b){
            if (jarj == 1) {
                if (a.nimi.toLowerCase() < b.nimi.toLowerCase()) return -1;
                if (a.nimi.toLowerCase() > b.nimi.toLowerCase()) return 1;
                else return 0;
            }
            if (jarj == -1) {
                if (a.nimi.toLowerCase() < b.nimi.toLowerCase()) return 1;
                if (a.nimi.toLowerCase() > b.nimi.toLowerCase()) return -1;
                else return 0;
            }
        });
    },
	render: function() {
    var ruokalaji = this.state.ruokalaji;
    var aineet = this.state.aineet;
    var liittyy = this.state.liittyy;
    var jarjestys = "";
    this.jarjesta(this.state.jarkka);
    if (this.state.jarkka == 1)
        jarjestys = "a -> z"
    else
        jarjestys = "z -> a"
		var nimet = this.state.resepti.map(function(name){
 	        return (
                       <li id="li_reseptit">
                           <ul id="ul_reseptit">
                              <label> {name.nimi}</label>
                              <ul>
                                 <RuokalajiComp ruokalaji={ruokalaji} ruokalajiID={name.ruokalaji} />
                                 <LiittyyComp aineet={aineet} liittyy={liittyy} reseptiID={name.key} />
                              </ul>
                           </ul>
                       </li>
                  )
        }
        );
    return (<div>
                <label id="jarjestys" onClick={this.kaanna} >{jarjestys}</label>
                <div>
                    <div id="div_reseptit">
                        <ul>{nimet}</ul>
                    </div>
                    <div id="div_lisays"><LisaysComp /></div>
                </div>
            </div>);

	}
});


//Komponentti lisäyslomakkeelle
var LisaysComp = React.createClass({
  render: function() {
    return (
      <form>Lisää resepti
          <fieldset>
              <p>
                  <label>Reseptin nimi</label>
                  <input type="text" ></input>
              </p>
              <p>
                  <label>Reseptin kuvaus</label>
                  <input type="text" ></input>
              </p>
              <p>
                  <label>Reseptin henkilömäärä</label>
                  <input type="number" ></input>
              </p>
              <p>
                  <label>Reseptin ruokalaji</label>
                  <input type="text" ></input>
              </p>
              
              

          </fieldset>
      </form>
    );
  }
});


//Komponentti liittyy
var LiittyyComp = React.createClass({
    render: function() {
      var tama = this;
      var aineet = tama.props.aineet;
      var liit = this.props.liittyy.map(function(name){
          if (tama.props.reseptiID == name.reseptiID)
              return ( <p><AineComp aineet={aineet} aineID={name.aineID} /> {name.maara} {name.lyhenne}</p> )
      });
      return ( <li>{liit}</li> );
    }
});


//Komponentti ainesosalle
var AineComp = React.createClass({
    render: function() {
      var tama = this;
      var aines = tama.props.aineet.map(function(name){
          if (tama.props.aineID == name.key)
              return ( name.aine )
      });
      return ( <span>{aines}</span> );
    }
});


//Komponentti ruokalajille
var RuokalajiComp = React.createClass({
    render: function() {
      var tama = this;
      var ruokal = this.props.ruokalaji.map(function(name){
          if (tama.props.ruokalajiID == name.key)
          return (name.nimi)
      });
      return (
        <li>{ruokal}</li>
      );
    }
});





//renderöidään komponentti sivulle
ReactDOM.render(
  <MyComponent />,
  document.getElementById('main')
);


//ajax virheille
  function ajaxVirhe(xhr, status, err){
    console.log(status + err.toString());
  }