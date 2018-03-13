import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

import { SearchForm, SearchResults } from './components';

class Search extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            city: '',
            results: [],
            bars: [],
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    
    componentDidMount() {
        // populate bars state
        const url = "https://fcc-dynamic-shlim45.c9users.io:8081/bars";
        fetch(url)
          .then(res => res.json())
          .then(data => {
              // pull the id STRING and going ARRAY out
              const bars = data.bars.map(bar => {
                  const {id, going} = bar;
                  return {id, going};
              });
            // const bars = data.bars.reduce((acc, next) => {
            //     const { id, going } = next;
            //     const bar = { id, going };
            //     return {bar, ...acc};
            // }, []);
              console.log({bars});
              this.setState({bars});
          })
          .catch(err => console.error(err));
    }
    
    handleSearch = (term, location) => {
        const url = new URL("https://fcc-dynamic-shlim45.c9users.io:8081/api/search"),
           params = { term, location };
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        fetch(url).then(res => res.json())
          .then(data => {
              this.setState({results: [...data]});
          })
         .catch(err => console.error(err));
        
    }
    
    onSubmit(e) {
        e.preventDefault();
        
        const {city} = this.state;
        if (city === '') return;
        this.handleSearch('bars', city);
    }

    onChange(e) {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
        });
    }

    render() {
        const { authenticated } = this.props;
        return (
            <Container text>
                <SearchForm onChange={this.onChange} onSubmit={this.onSubmit} {...this.state} />
                {this.state.results.length > 0 ?
                    <SearchResults authenticated={authenticated} { ...this.state } />
                    : null
                }
            </Container>
        );
    }
}

export default Search;
