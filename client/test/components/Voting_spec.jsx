import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Voting from '../../src/components/Voting';
import {expect} from 'chai';
import {List} from 'immutable';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate} = TestUtils;

describe("Voting", () => {
    it("renders a pair of buttons", () => {
        const component = renderIntoDocument(
            <Voting pair={["Trainspotting", "28 Days Later"]} />
        );
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons.length).to.equal(2);
        expect(buttons[0].textContent).to.equal('Trainspotting');
        expect(buttons[1].textContent).to.equal('28 Days Later');
    });

    it("invokes callback when a button is clicked", () => {
        let votedWith;
        const vote = (entry) => {
            console.log('on vote');
            votedWith = entry;
        };

        const component = renderIntoDocument(
            <Voting pair={["Trainspotting", "28 Days Later"]}
                    vote={vote}/>
        );
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');
        Simulate.click(buttons[0]);

        expect(votedWith).to.equal("Trainspotting");
    });

    it("disables buttons when user has voted", () => {
        const component = renderIntoDocument(
            <Voting pair={["Trainspotting", "28 Days Later"]}
                    hasVoted="Trainspotting" />
        );
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons.length).to.equal(2);
        expect(buttons[0].hasAttribute('disabled')).to.equal(true);
        expect(buttons[1].hasAttribute('disabled')).to.equal(true);
    });

    it("adds label to the voted entry", () => {
        const component = renderIntoDocument(
            <Voting pair={["Trainspotting", "28 Days Later"]}
                    hasVoted="Trainspotting" />
        );
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons[0].textContent).to.contain("Voted");
    });

    it("renders just a winner when there is one", () => {
        const component = renderIntoDocument(
            <Voting winner="Trainspotting" />
        );
        const buttons = scryRenderedDOMComponentsWithTag(component, 'button');

        expect(buttons.length).to.equal(0);

        const winner = ReactDom.findDOMNode(component.refs.winner);
        expect(winner).to.be.ok;
        expect(winner.textContent).to.contain('Trainspotting');
    });

    it("renders as a pure component", () => {
        const pair = ["Trainspotting", "28 Days Later"];
        const component = renderIntoDocument(
            <Voting pair={pair} />
        );

        let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
        expect(firstButton.textContent).to.equal("Trainspotting");

        pair[0] = "Sunshine";
        //component.setProps({pair: pair});
        ReactDom.render(<Voting pair={pair} />, ReactDom.findDOMNode(component).parentNode);
        firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
        expect(firstButton.textContent).to.equal("Trainspotting");
    });

    it("does update DOM when props change", () => {
        const pair = List.of("Trainspotting", "28 Days Later");
        const component = renderIntoDocument(
            <Voting pair={pair} />
        )

        let firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
        expect(firstButton.textContent).to.equal("Trainspotting");

        const newPair = pair.set(0, "Sunchine");
        //component.setProps({pair: newPair});
        ReactDom.render(<Voting pair={newPair} />, ReactDom.findDOMNode(component).parentNode);
        firstButton = scryRenderedDOMComponentsWithTag(component, 'button')[0];
        expect(firstButton.textContent).to.equal("Sunchine");
    });
});
