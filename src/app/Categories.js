import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import 'app/styles/components/Categories.scss';

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
      { ({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div className="alert-danger">Sorry, there was an error.</div>;

        return (
          <div className="categories-list">
            {data.categories.map(cat => (
              <div key={cat.id} className="category-item">
                {data.categories.length > 1 && <div className="category-title">Category: {cat.name}</div>}
                <ul className="tags-list">
                  {cat.tags && cat.tags.map(tag => (
                    <li key={tag.id} className="tag-item">
                      <input type="checkbox" name={tag.name} value={tag.id}/>
                      <span>{tag.name}</span>
                      <select>
                        <option>
                          Whole city
                        </option>
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          }
        </div>)
      }}
    </Query>
  }
}

export default Categories;
