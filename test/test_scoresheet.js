var assert = require('assert');

var tutils = require('./tutils');
var _describe = tutils._describe;
var _it = tutils._it;
var DOUBLES_SETUP = tutils.DOUBLES_SETUP;
var SINGLES_SETUP = tutils.SINGLES_SETUP;
var DOUBLES_SETUP_EN = tutils.DOUBLES_SETUP_EN;
var SINGLES_SETUP_EN = tutils.SINGLES_SETUP_EN;
var press_score = tutils.press_score;
var state_after = tutils.state_after;
var bup = tutils.bup;

(function() {
'use strict';

_describe('scoresheet generation', function() {
	function _scoresheet_cells(presses, setup) {
		var s = state_after(presses, setup);
		return bup.scoresheet._parse_match(s, 35);
	}

	function _assert_cell(cells, cell) {
		assert(cells.some(function(c) {
			return bup.utils.deep_equal(cell, c);
		}), 'Cannot find cell ' + JSON.stringify(cell) + ' in ' + JSON.stringify(cells, undefined, 2));
	}

	_it('0-0 in third game', function() {
		var presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}];
		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		press_score(presses, 21, 0);
		presses.push({
			type: 'postgame-confirm',
		});

		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		press_score(presses, 21, 0);
		presses.push({
			type: 'postgame-confirm',
		});

		presses.push({
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Andrew receives
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		cells.forEach(function(c) {
			assert.equal(typeof c.table, 'number', JSON.stringify(c) + ' is missing a table value');
			assert(! isNaN(c.table), JSON.stringify(c) + ' has NaN table value');
			assert.equal(typeof c.col, 'number', JSON.stringify(c) + ' is missing a col value');
			assert(! isNaN(c.table), JSON.stringify(c) + ' has NaN col value');
		});
		_assert_cell(cells, {
			table: 2,
			col: -1,
			row: 0,
			val: 'R',
		});
		_assert_cell(cells, {
			table: 2,
			col: -1,
			row: 2,
			val: 'A',
		});
		_assert_cell(cells, {
			table: 2,
			col: 0,
			row: 0,
			val: 0,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 2,
			col: 0,
			row: 2,
			val: 0,
			type: 'score',
		});
	});

	_it('overrule', function() {
		var presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}];
		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'overrule',
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 0,
			val: 0,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 0,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			val: 'O',
		});

		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'overrule',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 3,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 2,
			val: 'O',
		});

		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'referee',  // to ask how overruling works
		});
		presses.push({
			type: 'overrule',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 1,
			val: 2,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 0,
			val: 'O',
		});
	});

	_it('injuries', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'injury',
			team_id: 0,
			player_id: 0,
			timestamp: 1000,
		});
		presses.push({
			type: 'referee',
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 6);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 0,
			val: 'V',
			press_type: 'injury',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			val: 'R',
		});

		presses.push({
			type: 'injury',
			team_id: 1,
			player_id: 1,
			timestamp: 2000,
		});
		presses.push({
			type: 'referee',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 8);
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 3,
			val: 'V',
			press_type: 'injury',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 2,
			val: 'R',
		});

		presses.push({
			type: 'injury',
			team_id: 1,
			player_id: 0,
			timestamp: 3000,
		});
		presses.push({
			type: 'referee',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 10);
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 2,
			val: 'V',
			press_type: 'injury',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 2,
			val: 'R',
		});

		presses.push({
			type: 'injury-resume',
			timestamp: 130000,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 13);
		_assert_cell(cells, {
			type: 'vertical-text',
			table: 0,
			col: 1,
			row: 2.5,
			val: '2:09',
		});
		_assert_cell(cells, {
			type: 'vertical-text',
			table: 0,
			col: 2,
			row: 0.5,
			val: '2:08',
		});
		_assert_cell(cells, {
			type: 'vertical-text',
			table: 0,
			col: 3,
			row: 0.5,
			val: '2:07',
		});
	});

	_it('yellow card', function() {
		var base_presses = [];
		base_presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		base_presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		});
		base_presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		base_presses.push({
			type: 'love-all',
		});
		var presses = base_presses.slice();
		presses.push({
			type: 'yellow-card',
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'referee',
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			val: 'W',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 1,
			val: 'R',
		});

		presses.push({
			type: 'yellow-card',
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'referee',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 2,
			val: 'W',
		});
		_assert_cell(cells, {
			table: 0,
			col: 4,
			row: 2,
			val: 'R',
		});

		presses = base_presses.slice();
		presses.push({
			type: 'yellow-card',
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			val: 'W',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 1,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 1,
			val: 2,
			type: 'score',
		});
	});

	_it('referee', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Birgit serves
			team_id: 1,
			player_id: 1,
		});
		presses.push({
			type: 'pick_receiver', // Alice receives
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'referee', // Because of leaking roof
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			val: 'R',
		});
	});

	_it('suspension', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'suspension',
			timestamp: 1000000,
		});
		presses.push({
			type: 'referee',
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 3,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 1,
			val: 'U',
			_suspension_timestamp: 1000000,
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 1,
			val: 'R',
		});

		presses.push({
			type: 'resume',
			timestamp: 1519000,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 3,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 1,
			val: 'U',
			_suspension_timestamp: 1000000,
		});
		_assert_cell(cells, {
			type: 'vertical-text',
			table: 0,
			col: 2,
			row: 2.5,
			val: '8:39',
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 1,
			val: 'R',
		});

	});

	_it('red card', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'red-card',
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'referee',
		});
		presses.push({
			type: 'red-card',
			team_id: 0,
			player_id: 0,
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 3,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 0,
			val: 'R',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 0,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 3,
			val: 2,
			type: 'score',
		});

		presses.push({
			type: 'red-card',
			team_id: 1,
			player_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 3,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 0,
			val: 1,
			type: 'score',
		});
	});

	_it('red card in singles', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Alice picks left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'red-card',
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'referee',
		});
		presses.push({
			type: 'red-card',
			team_id: 1,
			player_id: 0,
		});

		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 2,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 3,
			val: 'R',
		});
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 0,
			val: 1,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 2,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 0,
			val: 2,
			type: 'score',
		});

		presses.push({
			type: 'red-card',
			team_id: 0,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 0,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 2,
			val: 1,
			type: 'score',
		});

		presses.push({
			type: 'red-card',
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'referee',
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);

		_assert_cell(cells, {
			table: 0,
			col: 4,
			row: 2,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 0,
			col: 4,
			row: 0,
			val: 3,
			type: 'score',
		});
		_assert_cell(cells, {
			table: 0,
			col: 4,
			row: 3,
			val: 'R',
		});
	});

	_it('red card after match', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		press_score(presses, 21, 5);
		presses.push({
			type: 'postgame-confirm',
		});
		presses.push({
			type: 'pick_server', // Alice serves
			team_id: 0,
			player_id: 1,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		press_score(presses, 0, 21);
		presses.push({  // Red card against Bob after he lost 21-0
			type: 'red-card',
			team_id: 1,
			player_id: 0,
		});

		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 1,
			col: 20,
			row: 1,
			type: 'score',
			val: 20,
		});
		_assert_cell(cells, {
			table: 1,
			col: 21,
			row: 1,
			type: 'score',
			val: 21,
		});
		_assert_cell(cells, {
			table: 1,
			col: 22,
			row: 2,
			val: 'F',
			press_type: 'red-card',
		});
		cells.forEach(function(cell) {
			if (cell.type == 'score') {
				assert(cell.val <= 21);
			}
		});
	});

	_it('retired', function() {
		var base_presses = [];
		base_presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		base_presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		base_presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		base_presses.push({
			type: 'love-all',
		});
		base_presses.push({
			type: 'score',
			side: 'left',
		});

		var presses = base_presses.slice();
		presses.push({
			type: 'retired',
			team_id: 1,
			player_id: 1,
		});
		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 3,
			val: 'A',
		});
		_assert_cell(cells, {
			table: 0,
			col: 5,
			type: 'circle',
			score: [1, 0],
			width: 3,
		});

		presses = base_presses.slice();
		presses.push({
			type: 'retired',
			team_id: 0,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 0,
			val: 'A',
		});
		_assert_cell(cells, {
			table: 0,
			col: 5,
			type: 'circle',
			score: [1, 0],
			width: 3,
		});
	});

	_it('disqualified', function() {
		var base_presses = [];
		base_presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		base_presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		base_presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		base_presses.push({
			type: 'love-all',
		});

		var presses = base_presses.slice();
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'disqualified',
			team_id: 1,
			player_id: 0,
		});
		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 2,
			type: 'longtext',
			val: 'Disqualifiziert',
			width: 4,
		});
		_assert_cell(cells, {
			table: 0,
			col: 8,
			type: 'circle',
			score: [1, 0],
			width: 3,
		});

		presses = base_presses.slice();
		presses.push({
			type: 'disqualified',
			team_id: 0,
			player_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 1,
			type: 'longtext',
			val: 'Disqualifiziert',
			width: 4,
		});
		_assert_cell(cells, {
			table: 0,
			col: 7,
			type: 'circle',
			score: [0, 0],
			width: 3,
		});
	});	

	_it('correction (service court error)', function() {
		var presses = [{
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		}];
		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});

		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'correction',
			team_id: 0,
		});
		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 3,
			type: 'score',
			val: 1,
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 1,
			type: 'score',
			val: 1,
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 0,
			val: 'C',
		});

		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'correction',
			team_id: 0,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 3,
			row: 2,
			type: 'score',
			val: 2,
		});
		_assert_cell(cells, {
			table: 0,
			col: 4,
			row: 0,
			type: 'score',
			val: 2,
		});
		_assert_cell(cells, {
			table: 0,
			col: 4,
			row: 1,
			val: 'C',
		});

		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'correction',
			team_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 5,
			row: 3,
			type: 'score',
			val: 3,
		});
		_assert_cell(cells, {
			table: 0,
			col: 6,
			row: 3,
			type: 'score',
			val: 4,
		});
		_assert_cell(cells, {
			table: 0,
			col: 6,
			row: 2,
			val: 'C',
		});

		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'correction',
			team_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 7,
			row: 1,
			type: 'score',
			val: 3,
		});
		_assert_cell(cells, {
			table: 0,
			col: 8,
			row: 2,
			type: 'score',
			val: 5,
		});
		_assert_cell(cells, {
			table: 0,
			col: 8,
			row: 3,
			val: 'C',
		});

		// Now against the receiver
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'correction',
			team_id: 0,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 9,
			row: 0,
			type: 'score',
			val: 4,
		});
		_assert_cell(cells, {
			table: 0,
			col: 10,
			row: 3,
			type: 'score',
			val: 6,
		});
		_assert_cell(cells, {
			table: 0,
			col: 11,
			row: 3,
			type: 'score',
			val: 7,
		});
		_assert_cell(cells, {
			table: 0,
			col: 11,
			row: 0,
			val: 'C',
		});

		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'correction',
			team_id: 0,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 12,
			row: 1,
			type: 'score',
			val: 5,
		});
		_assert_cell(cells, {
			table: 0,
			col: 13,
			row: 2,
			type: 'score',
			val: 8,
		});
		_assert_cell(cells, {
			table: 0,
			col: 13,
			row: 0,
			val: 'C',
		});

		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'correction',
			team_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 14,
			row: 0,
			type: 'score',
			val: 6,
		});
		_assert_cell(cells, {
			table: 0,
			col: 15,
			row: 0,
			type: 'score',
			val: 7,
		});
		_assert_cell(cells, {
			table: 0,
			col: 15,
			row: 3,
			val: 'C',
		});

		presses.push({
			type: 'score',
			side: 'right',
		});
		presses.push({
			type: 'score',
			side: 'left',
		});
		presses.push({
			type: 'correction',
			team_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 16,
			row: 3,
			type: 'score',
			val: 9,
		});
		_assert_cell(cells, {
			table: 0,
			col: 17,
			row: 1,
			type: 'score',
			val: 8,
		});
		_assert_cell(cells, {
			table: 0,
			col: 17,
			row: 3,
			val: 'C',
		});
	});

	_it('server mark in second game in singles', function() {
		var presses = [{
			type: 'pick_side', // Alice picks left
			team1_left: true,
		}];
		presses.push({
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 2,
			val: 'A',
		});

		press_score(presses, 21, 5);
		presses.push({
			type: 'postgame-confirm',
		});

		presses.push({
			type: 'love-all',
		});
		presses.push({
			type: 'score',
			side: 'right',
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		cells.forEach(function(cell) {
			assert(cell.val != 'R');
		});
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 2,
			val: 'A',
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 0,
			type: 'score',
			val: 0,
		});
		_assert_cell(cells, {
			table: 1,
			col: 1,
			row: 0,
			type: 'score',
			val: 1,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 2,
			type: 'score',
			val: 0,
		});
		_assert_cell(cells, {
			table: 1,
			col: -1,
			row: 0,
			val: 'A',
		});


		press_score(presses, 21, 4);
		presses.push({
			type: 'postgame-confirm',
		});

		presses.push({
			type: 'love-all',
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			table: 2,
			col: -1,
			row: 2,
			val: 'A',
		});

	});

	_it('aesthetic considerations for final circle', function() {
		var start_presses = [{
			type: 'pick_side', // Alice picks left
			team1_left: true,
		}, {
			type: 'pick_server', // Bob serves
			team_id: 1,
			player_id: 0,
		}, {
			type: 'love-all',
		}];

		// 21-10 should fit comfortably into the line
		var presses = start_presses.slice();
		press_score(presses, 21, 10);
		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 32,
			type: 'circle',
			score: [21, 10],
			width: 3,
		});

		// 21-11 should fit in one line
		// In German rules see Anweisungen für Technische Offizielle §8
		presses = start_presses.slice();
		press_score(presses, 21, 11);
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 33,
			type: 'circle',
			score: [21, 11],
			width: 2,
		});
	});

	_it('editmode set-score', function() {
		var presses = [];
		presses.push({
			type: 'editmode_set-score',
			score: [12, 5],
			by_side: false,
		});
		presses.push({
			type: 'pick_side',
			team1_left: true,
		});
		presses.push({
			type: 'pick_server',
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_server',
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 0,
			type: 'score',
			val: 12,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 2,
			type: 'score',
			val: 5,
		});

		press_score(presses, 0, 1);
		presses.push({
			type: 'editmode_set-score',
			score: [20, 4],
		});
		presses.push({
			type: 'editmode_set-score',
			score: [2, 14],
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 1,
			row: 3,
			type: 'score',
			val: 6,
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 0,
			type: 'score',
			val: 2,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 2,
			row: 3,
			type: 'score',
			val: 14,
			editmode_related: true,
		});
	});

	_it('editmode set-finished_games without by_side', function() {
		var presses = [];
		presses.push({
			type: 'editmode_set-finished_games',
			scores: [[12, 21], [25, 23]],
			by_side: false,
		});
		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 0,
			type: 'score',
			val: 12,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 2,
			type: 'score',
			val: 21,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			type: 'circle',
			score: [12, 21],
			width: 3,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 0,
			type: 'score',
			val: 25,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 2,
			type: 'score',
			val: 23,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 3,
			type: 'circle',
			score: [25, 23],
			width: 3,
		});

		presses.push({
			type: 'editmode_set-finished_games',
			scores: [],
			by_side: false,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 0);
	});

	_it('editmode set-finished_games with by_side', function() {
		var presses = [];
		presses.push({
			type: 'editmode_set-finished_games',
			scores: [{
				left: 12,
				right: 21,
			}, {
				left: 25,
				right: 23,
			}],
			by_side: true,
		});
		var cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 0,
			type: 'score',
			val: 12,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 2,
			type: 'score',
			val: 21,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			type: 'circle',
			score: [12, 21],
			width: 3,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 0,
			type: 'score',
			val: 25,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 2,
			type: 'score',
			val: 23,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 3,
			type: 'circle',
			score: [25, 23],
			width: 3,
		});

		var alt_presses = presses.slice();
		alt_presses.push({
			type: 'pick_side',
			team1_left: true,
		});
		cells = _scoresheet_cells(alt_presses, DOUBLES_SETUP);
		_assert_cell(cells, {
			table: 0,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 0,
			type: 'score',
			val: 12,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 2,
			type: 'score',
			val: 21,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			type: 'circle',
			score: [12, 21],
			width: 3,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 0,
			type: 'score',
			val: 25,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 2,
			type: 'score',
			val: 23,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 3,
			type: 'circle',
			score: [25, 23],
			width: 3,
		});

		presses.push({
			type: 'pick_side',
			team1_left: false,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		var s = state_after(presses, DOUBLES_SETUP);
		assert.deepEqual(s.match.finished_games[0].score, [21, 12]);
		_assert_cell(cells, {
			table: 0,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 0,
			type: 'score',
			val: 21,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 0,
			row: 2,
			type: 'score',
			val: 12,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 0,
			col: 3,
			type: 'circle',
			score: [21, 12],
			width: 3,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			type: 'editmode-sign',
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 0,
			type: 'score',
			val: 23,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 0,
			row: 2,
			type: 'score',
			val: 25,
			editmode_related: true,
		});
		_assert_cell(cells, {
			table: 1,
			col: 3,
			type: 'circle',
			score: [23, 25],
			width: 3,
		});
	});

	_it('setting past games multiple times', function() {
		var presses = [{
			type: 'editmode_set-finished_games',
			scores: [[4, 21], [21, 0]],
		}, {
			type: 'editmode_set-finished_games',
			scores: [[4, 21], [21, 5]],
		}];

		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			type: 'circle',
			table: 0,
			col: 3,
			score: [4, 21],
			width: 3,
		});
		_assert_cell(cells, {
			type: 'circle',
			table: 1,
			col: 3,
			score: [21, 5],
			width: 3,
		});
	});

	_it('a natural game should stay that way', function() {
		var presses = [];
		presses.push({
			type: 'pick_side', // Andrew&Alice pick left
			team1_left: true,
		});
		presses.push({
			type: 'pick_server', // Andrew serves
			team_id: 0,
			player_id: 0,
		});
		presses.push({
			type: 'pick_receiver', // Bob receives
			team_id: 1,
			player_id: 0,
		});
		presses.push({
			type: 'love-all',
		});
		press_score(presses, 21, 7);
		presses.push({
			type: 'postgame-confirm',
		});

		presses.push({
			type: 'editmode_set-finished_games',
			scores: [[21, 7], [12, 21]],
		});
		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert(! cells.some(function(cell) {
			return cell.table === 0 && cell.type == 'editmode-sign';
		}));
	});

	_it('correctly show resumed matches', function() {
		var presses = [{
			type: 'editmode_set-score',
			score: [2, 5],
			resumed: true,
		}];

		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 0,
			val: 2,
			editmode_related: true,
		});
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 2,
			val: 5,
			editmode_related: true,
		});

		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 3);
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 0,
			val: 2,
			editmode_related: true,
		});
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 2,
			val: 5,
			editmode_related: true,
		});

		presses.push({
			type: 'pick_server',
			team_id: 1,
			player_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 4);
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 0,
			val: 2,
			editmode_related: true,
		});
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 3,
			val: 5,
			editmode_related: true,
		});

		presses.push({
			type: 'pick_receiver',
			team_id: 0,
			player_id: 1,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP);
		assert.equal(cells.length, 5);
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 1,
			val: 2,
			editmode_related: true,
		});
		_assert_cell(cells, {
			type: 'score',
			table: 0,
			col: 0,
			row: 3,
			val: 5,
			editmode_related: true,
		});
	});

	_it('English symbols', function() {
		var presses = [{
			type: 'pick_side',
			team1_left: true,
		}];
		presses.push({
			type: 'pick_server',
			team_id: 1,
			player_id: 0,
		});

		var cells = _scoresheet_cells(presses, SINGLES_SETUP_EN);
		assert.equal(cells.length, 1);
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 2,
			val: 'S',
		});

		presses.push({
			type: 'pick_receiver',
			team_id: 0,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP_EN);
		assert.equal(cells.length, 2);
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 2,
			val: 'S',
		});
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 0,
			val: 'R',
		});

		presses.push({
			type: 'love-all',
		});
		cells = _scoresheet_cells(presses, DOUBLES_SETUP_EN);
		assert.equal(cells.length, 4);
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 2,
			val: 'S',
		});
		_assert_cell(cells, {
			table: 0,
			col: -1,
			row: 0,
			val: 'R',
		});

		var sav_presses = presses.slice();
		press_score(presses, 21, 4);
		presses.push({
			type: 'postgame-confirm',
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP_EN);
		_assert_cell(cells, {
			table: 1,
			col: -1,
			row: 0,
			val: 'S',
		});

		presses = sav_presses.slice();
		press_score(presses, 4, 21);
		presses.push({
			type: 'postgame-confirm',
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP_EN);
		_assert_cell(cells, {
			table: 1,
			col: -1,
			row: 2,
			val: 'S',
		});
	});

	_it('red card at match start', function() {
		// According to RTTO 3.7.7, red cards before or after the match do not influence the score
		var presses = [{
			type: 'pick_side',
			team1_left: true,
		}];

		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells, []);

		presses.push({
			type: 'red-card',
			team_id: 0,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells, [{
			col: 0,
			row: 0,
			table: 0,
			val: 'F',
			press_type: 'red-card',
		}]);

		presses.push({
			type: 'pick_server',
			team_id: 0,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells.length, 2);

		presses.push({
			type: 'red-card',
			team_id: 1,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells.length, 3);
		_assert_cell(cells, {
			col: 1,
			row: 2,
			table: 0,
			val: 'F',
			press_type: 'red-card',
		});

		presses.push({
			type: 'love-all',
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells.length, 5);
		_assert_cell(cells, {
			type: 'score',
			col: 2,
			row: 0,
			table: 0,
			val: 0,
		});
		_assert_cell(cells, {
			type: 'score',
			col: 2,
			row: 2,
			table: 0,
			val: 0,
		});

		press_score(presses, 21, 0);
		presses.push({
			type: 'postgame-confirm',
		});
		presses.push({
			type: 'love-all',
		});
		press_score(presses, 0, 21);
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells.length, 52);
		_assert_cell(cells, {
			type: 'score',
			col: 21,
			row: 0,
			table: 1,
			val: 21,
		});
		_assert_cell(cells, {
			type: 'circle',
			col: 24,
			table: 1,
			score: [21, 0],
			width: 3,
		});

		presses.push({
			type: 'red-card',
			team_id: 0,
			player_id: 0,
		});
		cells = _scoresheet_cells(presses, SINGLES_SETUP);
		assert.deepStrictEqual(cells.length, 53);
		_assert_cell(cells, {
			table: 1,
			col: 22,
			row: 0,
			val: 'F',
			press_type: 'red-card',
		});
		_assert_cell(cells, {
			table: 1,
			type: 'circle',
			col: 25,
			score: [21, 0],
			width: 3,
		});
	});

	_it('match end after injury', function() {
		var presses = [{
			type: 'pick_side',
			team1_left: true,
		}, {
			type: 'pick_server',
			team_id: 0,
			player_id: 0,
		}, {
			type: 'love-all',
		}];

		presses.push({
			type: 'injury',
			team_id: 0,
			player_id: 0,
			timestamp: 1000,
		});
		var base_presses = presses.slice();

		presses.push({
			type: 'retired',
			team_id: 0,
			player_id: 0,
			timestamp: 10000,
		});
		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			col: 1,
			row: 0,
			table: 0,
			val: 'V',
			press_type: 'injury',
		});
		_assert_cell(cells, {
			type: 'vertical-text',
			col: 1,
			row: 2.5,
			table: 0,
			val: '0:09',
		});

		presses = base_presses.slice();
		presses.push({
			type: 'disqualified',
			team_id: 1,
			player_id: 0,
			timestamp: 10000,
		});
		var cells = _scoresheet_cells(presses, SINGLES_SETUP);
		_assert_cell(cells, {
			col: 1,
			row: 0,
			table: 0,
			val: 'V',
			press_type: 'injury',
		});
		_assert_cell(cells, {
			type: 'vertical-text',
			col: 1,
			row: 2.5,
			table: 0,
			val: '0:09',
		});

	});
});

})();