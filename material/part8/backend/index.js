const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid');
const { GraphQLError } = require('graphql')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = /* GraphQL */ `
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) { // there is no phone argument
        return persons
      }
      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone  // person.phone is true if it is not null
      return persons.filter(byPhone)
    },
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },

  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  },

  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    },
    editNumber: (root, args) => {
      const person = persons.find(p => p.name === args.name)
      if (!person) {
        return null
      }

      const updatedPerson = { ...person, phone: args.phone }
      persons = persons.map(p => p.name === args.name ? updatedPerson : p)
      return updatedPerson
    }
  }

  /**
   * Person: {
       street: (root) => "Manhattan",
       city: (root) => "New York"
     }
   */
  /** default resolver:
   *Person: {
      name: (root) => root.name,
      phone: (root) => root.phone,
      street: (root) => root.street,
      city: (root) => root.city,
      id: (root) => root.id
    }
   */
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  cors: {
    origin: 'https://orange-goldfish-5gx9x65qv5g62vq9-5173.app.github.dev', // 你的前端地址
    credentials: true, 
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})





/**
 * root: the returned object of last layer
 * query {
    findPerson(name: "Arto Hellas") {
      phone
      city
      street
    }
   }
   root of query is {}
   execute findPerson({}, {name: "Arto Hellas"}) on this empty object, return
   {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
   },
   It knows this object is a Person, because findPerson is stated to return a person
   it will go find resolvers in Person {}
   execute phone on this object, phone resolver is default, return root.phone,
   execute city and  street on this object, which is defined to retun "New York" and "Manhattan"
   so the returned value is
    {
      "data": {
        "findPerson": {
          "phone": "040-123543",
          "city": "New York",
          "street": "Manhattan"
        }
      }
    }
 */

/**
 * why the server does not need to change:
 * findPerson returns
 * {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
   },
 * GraphQL doesn’t care whether it’s “really a Person object” stated in schema.
   It just checks that the returned object has the fields that the schema requires
 * (or that resolvers for those fields can produce)
 */
