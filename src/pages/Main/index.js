import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../Components/Container';
import { Form, SubmitButton, List, RepoNotFound } from './styles';

export default class Main extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: null
  };

  // carrega os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Salvar os dados inseridos
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleDelete = repository => {
    const { repositories } = this.state;

    this.setState({
      repositories: repositories.filter(newR => newR !== repository)
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, error: false });

    try {
      const { newRepo, repositories } = this.state;

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false
      });
    } catch (err) {
      this.setState({ loading: false, error: true });
      console.log(`${err}`);
    }
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          {/* Conditional rendering */}
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <RepoNotFound error={error ? 1 : 0} hidden>
          {error ? 'Repositório não encontrado' : null}
        </RepoNotFound>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>

              <div>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                  Detalhes
                </Link>

                <button
                  type="button"
                  onClick={() => this.handleDelete(repository)}
                >
                  <MdDeleteSweep />
                </button>
              </div>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
