import React, { Component } from 'react';
import {
    Form,
    Button,
    Input,
    Container,
    Item,
}
from 'semantic-ui-react';

const SearchForm = (props) => {
    const { onChange, onSubmit, city } = props; // , results
    return (
        <Container text>
        <Form>
            <Form.Field>
                <Input
                  name="city"
                  onChange={onChange}
                  value={city}
                  placeholder="WHERE YOU AT?"
                  fluid
                />
            </Form.Field>
            <Button onClick={onSubmit}>Submit</Button>
        </Form>
        </Container>
    );
};

const Result = (props) => {
    const { result } = props;
    return (
        <Item>
          <Item.Image size='tiny' src={result.image_url} />
    
          <Item.Content>
            <Item.Header as='a'>{ result.name }</Item.Header>
            <Item.Meta>Description..</Item.Meta>
            <Item.Description>
              
            </Item.Description>
            <Item.Extra>Additional Details</Item.Extra>
          </Item.Content>
        </Item>
    );
}

const SearchResults = (props) => {
    const { results } = props;
    return (
        <Item.Group>
            { results.map(result => (
                <Result key={ result.id }result={result} />
            )) }
        </Item.Group>
    );
}

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            city: '',
            results: [],
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    
    handleSearch = (category, location) => {
        const url = new URL("https://fcc-dynamic-shlim45.c9users.io:8081/api/search"),
           params = { category, location };
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
        this.handleSearch('bars', city);
    }

    onChange(e) {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <Container text>
                <SearchForm onChange={this.onChange} onSubmit={this.onSubmit} {...this.state} />
                {this.state.results.length > 0 ?
                    <SearchResults { ...this.state } />
                    : null
                }
            </Container>
        );
    }
}

export default Search;
