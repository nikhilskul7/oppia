// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Rules service for the interaction.
 */


import { InteractionsExtensionsConstants } from
  'interactions/interactions-extension.constants';
import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';

import { IMusicNotesAnswer } from 'interactions/answer-defs';
import { UtilsService } from 'services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class MusicNotesInputRulesService {
  constructor(private utilsService: UtilsService) {}

  static _getMidiNoteValue(note: IMusicNotesAnswer): number {
    if (
      InteractionsExtensionsConstants.NOTE_NAMES_TO_MIDI_VALUES.hasOwnProperty(
        note.readableNoteName)) {
      return InteractionsExtensionsConstants.NOTE_NAMES_TO_MIDI_VALUES[
        note.readableNoteName];
    } else {
      throw new Error('Invalid music note ' + note);
    }
  }

  static _convertSequenceToMidi(sequence): number[] {
    return sequence.map((note) => {
      return MusicNotesInputRulesService._getMidiNoteValue(note);
    });
  }

  Equals(
      answer: IMusicNotesAnswer[], inputs: {x: IMusicNotesAnswer[]}): boolean {
    return this.utilsService.isEquivalent(
      MusicNotesInputRulesService._convertSequenceToMidi(answer),
      MusicNotesInputRulesService._convertSequenceToMidi(inputs.x));
  }
  IsLongerThan(
      answer: IMusicNotesAnswer[],
      inputs: {k: number}): boolean {
    return MusicNotesInputRulesService._convertSequenceToMidi(
      answer).length > inputs.k;
  }
  // TODO(wxy): Validate that inputs.a <= inputs.b.
  HasLengthInclusivelyBetween(
      answer: IMusicNotesAnswer[],
      inputs: {a: number, b: number}): boolean {
    var answerLength:number = (
      MusicNotesInputRulesService._convertSequenceToMidi(answer).length);
    return answerLength >= inputs.a && answerLength <= inputs.b;
  }
  IsEqualToExceptFor(
      answer: IMusicNotesAnswer[],
      inputs: {x: IMusicNotesAnswer[], k: number}): boolean {
    var targetSequence: number[] = (
      MusicNotesInputRulesService._convertSequenceToMidi(inputs.x));
    var userSequence: number[] = (
      MusicNotesInputRulesService._convertSequenceToMidi(answer));
    if (userSequence.length !== targetSequence.length) {
      return false;
    }

    var numWrongNotes: number = 0;
    userSequence.map(function(noteValue, index) {
      if (noteValue !== targetSequence[index]) {
        numWrongNotes++;
      }
    });
    return numWrongNotes <= inputs.k;
  }
  IsTranspositionOf(
      answer: IMusicNotesAnswer[],
      inputs: {x: IMusicNotesAnswer[], y: number}): boolean {
    var targetSequence: number[] = (
      MusicNotesInputRulesService._convertSequenceToMidi(inputs.x));
    var userSequence: number[] = (
      MusicNotesInputRulesService._convertSequenceToMidi(answer));
    if (userSequence.length !== targetSequence.length) {
      return false;
    }
    return userSequence.every((noteValue, index) => {
      return targetSequence[index] + inputs.y === noteValue;
    });
  }
  IsTranspositionOfExceptFor(
      answer: IMusicNotesAnswer[],
      inputs: {x: IMusicNotesAnswer[], y: number, k: number}): boolean {
    var targetSequence: number[] = (
      MusicNotesInputRulesService._convertSequenceToMidi(inputs.x));
    var userSequence: number[] = (
      MusicNotesInputRulesService._convertSequenceToMidi(answer));
    if (userSequence.length !== targetSequence.length) {
      return false;
    }

    var numWrongNotes: number = 0;
    userSequence.map((noteValue, index) => {
      if (targetSequence[index] + inputs.y !== noteValue) {
        numWrongNotes++;
      }
    });
    return numWrongNotes <= inputs.k;
  }
}

angular.module('oppia').factory(
  'MusicNotesInputRulesService',
  downgradeInjectable(MusicNotesInputRulesService));
