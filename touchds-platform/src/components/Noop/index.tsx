import React from 'react';

export default class Noop extends React.Component<any, any> {
    render() {
        return null;
    }

    static Span = class Span extends React.Component<any, any> {
        render() {
            return <span/>;
        }
    };

    static TableHead = class Span extends React.Component<any, any> {
        render() {
            return <thead/>;
        }
    };
}
