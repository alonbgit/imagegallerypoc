import React, { Component } from 'react';
import './image-gallery.scss';
import classNames from 'classnames';

class ImageGallery extends Component {
    constructor (props) {
        super(props);
        this.isTransition = false;
    }

    state = {
        position: 0,
        isNextEnabled: false,
        isPrevEnabled: false,
        isTransition: false,
    }

    componentDidMount () {
        this.contentRef.addEventListener('transitionend', () => this.isTransition = false);
        this.checkDirectionButtons();
    }

    componentWillReceiveProps (nextProps) {
        // in case the number of children has been reduced,
        // we set the gallery position to 0
        if (nextProps.children.length < this.props.children.length) {
            this.setState({
                position: 0,
            });
        }
    }

    componentDidUpdate (previousProps) {
        if (previousProps.children !== this.props.children) {
            this.checkDirectionButtons();
        }
    }

    checkDirectionButtons () {
        this.setState({
            isNextEnabled: this.canMoveNext(),
            isPrevEnabled: this.canMovePrev(),
        });
    }

    canMoveNext () {
        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        return contentRect.right > scrollerRect.right;
    }

    canMovePrev () {
        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        return contentRect.left < scrollerRect.left;

    }

    moveNext = () => {
        // in case the gallery is currently transitioned, don't do anything
        if (this.isTransition) {
            return;
        }

        // checks if the gallery can move next
        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        if (contentRect.right <= scrollerRect.right) {
            return;
        }

        const diff = contentRect.right - scrollerRect.right;
        let position;
        let isNextEnabled = true;

        if (diff <= scrollerRect.width) {
            position = this.state.position + diff; 
            isNextEnabled = false;
        } else {
            const children = this.contentRef.children;
            for (let i = 0; i < children.length; i++) {
                const childRect = children[i].getBoundingClientRect();
                if (childRect.right >= scrollerRect.right) {
                    position = children[i].offsetLeft;
                    break;
                }
            }
        }

        this.isTransition = true;

        this.setState({
            position,
            isNextEnabled,
            isPrevEnabled: true,
        });

    }

    movePrev = () => {
        // in case the gallery is currently transitioned, don't do anything
        if (this.isTransition) {
            return;
        }

        // checks if the gallery can move previous
        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        if (contentRect.left >= scrollerRect.left) {
            return;
        }

        const diff = scrollerRect.left - contentRect.left;
        let position;
        let isPrevEnabled = true;
        if (diff <= scrollerRect.width) {
            position = this.state.position - diff;
            isPrevEnabled = false;
        } else {
            const children = this.contentRef.children;
            for (let i = children.length - 1; i >= 0; i--) {
                const childRect = children[i].getBoundingClientRect();
                if (childRect.left <= scrollerRect.left) {
                    position = children[i + 1].offsetLeft - scrollerRect.width;
                    break;
                }
            }
        }

        this.isTransition = true;

        this.setState({
            position,
            isNextEnabled: true,
            isPrevEnabled,
        });
    }

    render () {
        return (
            <div className='image-gallery'>
                <i 
                    onClick={this.movePrev}
                    className={classNames('gallery-arrow gallery-arrow-left fas fa-angle-left', { hidden: !this.state.isPrevEnabled })}
                />
                <div className='scroller' ref={(c) => { this.scrollerRef = c; }}>
                    <div
                        className='content'
                        style={{ transform: `translateX(${-this.state.position}px)` }}
                        ref={(c) => { this.contentRef = c; } }
                    >
                        {this.props.children}
                    </div>
                </div>
                <i
                    onClick={this.moveNext}
                    className={classNames('gallery-arrow gallery-arrow-right fas fa-angle-right', { hidden: !this.state.isNextEnabled })}
                />
            </div>
        );
    }
}

export default ImageGallery;
