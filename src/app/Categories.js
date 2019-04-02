import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const CATEGORIES_QUERY = gql`
  query categories {
    categories {
      name
      id
      tags {
        id
        name
      }
    }
  }
`

class Categories extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <Query
      query={CATEGORIES_QUERY}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <div className="alert-danger">Sorry, there was an error.</div>;
        
        console.log(data);

        return data.categories.map(cat => (
          <div key={cat.id}>
            <div>{cat.name}</div>
            {cat.tags && cat.tags.map(tag => (
              <div key={tag.id}>
                {tag.name}
              </div>
            ))}
          </div>
        ))
      }}
    </Query>
  }
}

export default Categories;
