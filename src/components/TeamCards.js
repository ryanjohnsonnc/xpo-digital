import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'
import Modal from 'react-modal'
//import Content, { HTMLContent } from '../components/Content'

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#___gatsby')

class TeamCards extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }
  
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <div className="c_teamCards"> 
        <div className="columns is-multiline">
          {posts &&
            posts.map((
              { node: post }
            ) => (
              <div className="is-parent column is-3 teamCards_card" key={post.id}>
                <div class="card_wrapper">
                  {post.frontmatter.featuredimage ? (
                    <div className="card_image">
                      <PreviewCompatibleImage
                        imageInfo={{
                          image: post.frontmatter.featuredimage,
                          alt: `Picture of ${
                            post.name
                          }`,
                        }}
                      />
                    </div>
                  ) : 'no image'}

                  <Link
                    className="title is-size-4 card_title"
                    to='/about'
                  >
                    {post.frontmatter.name}
                  </Link>
                </div>

                <button onClick={this.openModal}>Open Modal</button>
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  style={modalStyles}
                  contentLabel="Example Modal"
                >

                  <h2 className="title" ref={subtitle => this.subtitle = subtitle}>{post.frontmatter.name}</h2>
                  <h3>{post.frontmatter.title}</h3>
                  {/* <p>{post.frontmatter.}</p> */}
                  <button onClick={this.closeModal}>close</button>
                  
                </Modal>

              </div>
            ))}
        </div>
      </div>
    )
  }
}

TeamCards.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query TeamCards {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "team-member" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              html
              frontmatter {
                title
                name
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <TeamCards data={data} count={count} />}
  />
)
