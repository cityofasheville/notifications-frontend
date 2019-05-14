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

const radiusMilesOpts = [
  0.25,
  0.5,
  1,
  2,
  3,
  'Whole City',
]

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

        console.log(data.categories)

        return (
          <div className="categories-list">
            {data.categories.map(cat => (
              <div key={cat.id} className="category-item">
                {data.categories.length > 1 && <div className="category-title">Category: {cat.name}</div>}
                <ul className="tags-list">
                  {cat.tags && cat.tags.map(tag => {
                    const userSub = this.props.userSubscriptions ? this.props.userSubscriptions.find(sub => sub.tag.id === tag.id) : undefined;
                    let userPreference = 'Whole City';
                    if (userSub) {
                      userPreference = userSub.whole_city ? 'Whole City' : userSub.radius_miles;
                    }

                    return (<li key={tag.id} className="tag-item">
                      <input type="checkbox" name={tag.name} value={tag.id}/>
                      <span>{tag.name}</span>
                      <select>
                        {radiusMilesOpts.map(opt => (
                          <option
                            value="opt"
                            selected={opt === userPreference}
                          >
                            {isNaN(opt) ? opt : `${opt} miles`}
                          </option>
                        ))}
                      </select>
                    </li>);
                  })}
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
