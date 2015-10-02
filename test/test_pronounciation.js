'use strict';

var assert = require('assert');

var test_utils = require('./test_utils');
var _describe = test_utils._describe;
var _it = test_utils._it;
var DOUBLES_SETUP = test_utils.DOUBLES_SETUP;
var DOUBLES_TEAM_SETUP = test_utils.DOUBLES_TEAM_SETUP;
var SINGLES_SETUP = test_utils.SINGLES_SETUP;
var SINGLES_TEAM_SETUP = test_utils.SINGLES_TEAM_SETUP;
var state_after = test_utils.state_after;
var press_score = test_utils.press_score;

var bup = require('../bup.js');

_describe('pronounciation', function() {
	_it('Start of match (singles)', function() {
		var presses = [];
		var s = state_after(presses, DOUBLES_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_receiver', // Birgit receives
			team_id: 1,
			player_id: 1
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Bob / Birgit,\n' +
			'und zu meiner Linken, Andrew / Alice.\n' +
			'Andrew schlägt auf zu Birgit.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Andrew&Alice pick right
			team1_left: false,
		}, {
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		}, {
			type: 'pick_receiver', // Birgit receives
			team_id: 1,
			player_id: 1
		}];
		s = state_after(presses, DOUBLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Andrew / Alice,\n' +
			'und zu meiner Linken, Bob / Birgit.\n' +
			'Alice schlägt auf zu Birgit.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}, {
			type: 'pick_receiver', // Alice receives
			team_id: 0,
			player_id: 1
		}];
		s = state_after(presses, DOUBLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Bob / Birgit,\n' +
			'und zu meiner Linken, Andrew / Alice.\n' +
			'Bob schlägt auf zu Alice.\n' +
			'0 beide. Bitte spielen.'
		);
	});

	_it('Start of match (singles)', function() {
		var presses = [];
		var s = state_after(presses, SINGLES_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_side', // Alice picks left
			team1_left: true,
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 0,
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Bob,\n' +
			'und zu meiner Linken, Alice.\n' +
			'Alice schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Alice picks right
			team1_left: false,
		}, {
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 0,
		}];
		s = state_after(presses, SINGLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Alice,\n' +
			'und zu meiner Linken, Bob.\n' +
			'Alice schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Alice picks left
			team1_left: true,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}];
		s = state_after(presses, SINGLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Bob,\n' +
			'und zu meiner Linken, Alice.\n' +
			'Bob schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Alice picks right
			team1_left: false,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}];
		s = state_after(presses, SINGLES_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, Alice,\n' +
			'und zu meiner Linken, Bob.\n' +
			'Bob schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);
	});

	_it('Start of match in a team competition (doubles)', function() {
		var presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}, {
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		}, {
			type: 'pick_receiver', // Birgit receives
			team_id: 1,
			player_id: 1
		}];
		var s = state_after(presses, DOUBLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, B team, vertreten durch Bob / Birgit,\n' +
			'und zu meiner Linken, A team, vertreten durch Andrew / Alice.\n' +
			'A team schlägt auf, Alice zu Birgit.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Andrew&Alice pick right
			team1_left: false,
		}, {
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		}, {
			type: 'pick_receiver', // Birgit receives
			team_id: 1,
			player_id: 1
		}];
		s = state_after(presses, DOUBLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Linken, B team, vertreten durch Bob / Birgit,\n' +
			'und zu meiner Rechten, A team, vertreten durch Andrew / Alice.\n' +
			'A team schlägt auf, Alice zu Birgit.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Andrew&Alice pick right
			team1_left: false,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}, {
			type: 'pick_receiver', // Andrew receives
			team_id: 0,
			player_id: 0
		}];
		s = state_after(presses, DOUBLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Linken, B team, vertreten durch Bob / Birgit,\n' +
			'und zu meiner Rechten, A team, vertreten durch Andrew / Alice.\n' +
			'B team schlägt auf, Bob zu Andrew.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}, {
			type: 'pick_server', // Birgit serves
			team_id: 1,
			player_id: 1,
		}, {
			type: 'pick_receiver', // Andrew receives
			team_id: 0,
			player_id: 0
		}];
		s = state_after(presses, DOUBLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, B team, vertreten durch Bob / Birgit,\n' +
			'und zu meiner Linken, A team, vertreten durch Andrew / Alice.\n' +
			'B team schlägt auf, Birgit zu Andrew.\n' +
			'0 beide. Bitte spielen.'
		);
	});

	_it('Match start in a team competition (singles)', function() {
		var presses = [];
		var s = state_after(presses, SINGLES_TEAM_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_side', // Alice picks left
			team1_left: true,
		});
		s = state_after(presses, SINGLES_TEAM_SETUP);
		assert.strictEqual(bup.pronounciation(s), null);

		presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 0,
		});
		s = state_after(presses, SINGLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, B team, vertreten durch Bob,\n' +
			'und zu meiner Linken, A team, vertreten durch Alice.\n' +
			'A team schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Alice picks right
			team1_left: false,
		}, {
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 0,
		}];
		s = state_after(presses, SINGLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Linken, B team, vertreten durch Bob,\n' +
			'und zu meiner Rechten, A team, vertreten durch Alice.\n' +
			'A team schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Alice picks left
			team1_left: true,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}];
		s = state_after(presses, SINGLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Rechten, B team, vertreten durch Bob,\n' +
			'und zu meiner Linken, A team, vertreten durch Alice.\n' +
			'B team schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);

		presses = [{
			type: 'pick_side', // Alice picks right
			team1_left: false,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}];
		s = state_after(presses, SINGLES_TEAM_SETUP);
		assert.strictEqual(
			bup.pronounciation(s),
			'Meine Damen und Herren:\n' +
			'Zu meiner Linken, B team, vertreten durch Bob,\n' +
			'und zu meiner Rechten, A team, vertreten durch Alice.\n' +
			'B team schlägt auf.\n' +
			'0 beide. Bitte spielen.'
		);
	});

	_it('Basic counting (doubles)', function() {
		var presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}, {
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		}, {
			type: 'pick_receiver', // Birgit receives
			team_id: 1,
			player_id: 1
		}, {
			type: 'love-all'
		}, {
			'type': 'score',
			'side': 'left'
		}];
		var s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '1-0');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '2-0');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 1-2');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '2 beide');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '3-2');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '4-2');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 3-4');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '4 beide');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), '5-4');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, DOUBLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 5 beide');
	});

	_it('Basic counting (singles)', function() {
		var presses = [{
			type: 'pick_side', // Alice picks right
			team1_left: false,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}, {
			type: 'love-all'
		}, {
			'type': 'score',
			'side': 'left'
		}];
		var s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '1-0');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '2-0');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 1-2');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '2 beide');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '3-2');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '4-2');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 3-4');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '4 beide');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '5-4');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 5 beide');
	});

	_it('Pause / game point', function() {
		var presses = [{
			type: 'pick_side', // Alice picks right
			team1_left: true,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}, {
			type: 'love-all'
		}];
		press_score(presses, 9, 9);
		presses.push({
			'type': 'score',
			'side': 'left'
		});
		presses.push({
			'type': 'score',
			'side': 'left'
		});
		var s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '11-9 Pause');

		press_score(presses, 8, 9);
		presses.push({
			'type': 'score',
			'side': 'right'
		});
		var alt_presses = presses.slice();
		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 20 Satzpunkt 19');

		alt_presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(alt_presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '20 Satzpunkt 19');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 20 beide');

		presses.push({
			'type': 'score',
			'side': 'right'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), '21-20');

		presses.push({
			'type': 'score',
			'side': 'left'
		});
		s = state_after(presses, SINGLES_SETUP);
		assert.equal(bup.pronounciation(s), 'Aufschlagwechsel. 21 beide');
	});

});
