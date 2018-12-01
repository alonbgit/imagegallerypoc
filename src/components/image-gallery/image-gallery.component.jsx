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
        isRightEnabled: false,
        isLeftEnabled: false,
        isTransition: false,
    }

    componentDidMount () {
        this.contentRef.addEventListener('transitionend', this.onTransitionEnd);
        this.checkCanMoveNext();
        this.checkCanMovePrev();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.children.length < this.props.children.length) {
            this.setState({
                position: 0,
            });
        }
    }

    componentDidUpdate (previousProps) {
        if (previousProps.children !== this.props.children) {
            this.checkCanMoveNext();
            this.checkCanMovePrev();
        }
    }
    
    onTransitionEnd = () => {
        this.isTransition = false;
    }

    checkCanMoveNext () {
        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        let isRightEnabled = false;
        if (contentRect.right > scrollerRect.right) {
            isRightEnabled = true;
        }
        this.setState({
            isRightEnabled,
        });
    }

    checkCanMovePrev () {
        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        let isLeftEnabled = false;
        if (contentRect.left < scrollerRect.left) {
            isLeftEnabled = true;
        }
        this.setState({
            isLeftEnabled,
        });
    }

    moveNext = () => {
        if (this.isTransition) {
            return;
        }

        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        if (contentRect.right <= scrollerRect.right) {
            return;
        }

        this.isTransition = true;

        const diff = contentRect.right - scrollerRect.right;
        let position;
        let isRightEnabled = true;

        if (diff <= scrollerRect.width) {
            position = this.state.position + diff; 
            isRightEnabled = false;
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

        this.setState({
            position,
            isRightEnabled,
            isLeftEnabled: true,
        });

    }

    movePrev = () => {
        if (this.isTransition) {
            return;
        }

        const contentRect = this.contentRef.getBoundingClientRect();
        const scrollerRect = this.scrollerRef.getBoundingClientRect();
        if (contentRect.left >= scrollerRect.left) {
            return;
        }

        this.isTransition = true;

        const diff = scrollerRect.left - contentRect.left;
        let position;
        let isLeftEnabled = true;
        if (diff <= scrollerRect.width) {
            position = this.state.position - diff;
            isLeftEnabled = false;
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

        this.setState({
            position,
            isRightEnabled: true,
            isLeftEnabled,
        });
    }

    render () {
        return (
            <div className='image-gallery'>
                <i 
                    onClick={this.movePrev}
                    className={classNames('gallery-arrow gallery-arrow-left fas fa-angle-left', { hidden: !this.state.isLeftEnabled })}
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
                    className={classNames('gallery-arrow gallery-arrow-right fas fa-angle-right', { hidden: !this.state.isRightEnabled })}
                />
            </div>
        );
    }

}

export default ImageGallery;