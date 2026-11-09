import { Component } from 'react';

/**
 * Ловить помилки рендерингу в дочірніх компонентах.
 * Error boundary можна зробити лише класовим компонентом:
 * він використовує getDerivedStateFromError і componentDidCatch.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Помилка рендерингу:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="page-message">
        <h1 className="page-message__title">Сторінка не відобразилась</h1>
        <p className="page-message__text">
          Під час показу сторінки сталася помилка. Оновіть сторінку, щоб спробувати ще раз.
        </p>
        <button type="button" className="button button--primary" onClick={this.handleReload}>
          Оновити сторінку
        </button>
      </main>
    );
  }
}
