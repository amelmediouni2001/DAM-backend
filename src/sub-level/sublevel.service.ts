import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';

import {Sublevel, SublevelDocument} from './schema/sublevel.schema';
import {CreateSublevelDto} from './dto/create-sublevel.dto';
import {UpdateSublevelDto} from './dto/update-sublevel.dto';

@Injectable()
export class SublevelsService {

    constructor(
        @InjectModel(Sublevel.name)
        private sublevelModel: Model<SublevelDocument>,
    ) {}

    async create(dto: CreateSublevelDto) {
        const sublevel = new this.sublevelModel(dto);
        return sublevel.save();
    }

    // Helper to transform notes for Android app compatibility
    private transformNotesForAndroid(notes: any[]): { notes: string[], noteDurations: string[] } {
        const notesList: string[] = [];
        const durationsList: string[] = [];

        notes.forEach((noteObj) => {
            if (noteObj.type === 'note') {
                // Single note: add the note name
                notesList.push(noteObj.note);
                durationsList.push(noteObj.duration || 'short');
            } else if (noteObj.type === 'chord') {
                // Chord: take only the first note from the chord
                if (noteObj.notes && Array.isArray(noteObj.notes) && noteObj.notes.length > 0) {
                    notesList.push(noteObj.notes[0]);
                    durationsList.push(noteObj.duration || 'short');
                }
            }
        });

        return { notes: notesList, noteDurations: durationsList };
    }

    async findAll() {
        const sublevels = await this.sublevelModel.find().populate('levelId').lean().exec();
        return sublevels.map(sub => {
            const { notes, noteDurations } = this.transformNotesForAndroid(sub.notes || []);
            return {
                ...sub,
                notes,
                noteDurations
            };
        });
    }

    async findByLevel(levelId: string){
        const sublevels = await this.sublevelModel
        .find({levelId})
        .sort({index: 1})
        .lean()
        .exec();
        
        return sublevels.map(sub => {
            const { notes, noteDurations } = this.transformNotesForAndroid(sub.notes || []);
            return {
                ...sub,
                notes,
                noteDurations
            };
        });
    }

    async findOne(id: string){
        const sub = await this.sublevelModel.findById(id);
        if(!sub) throw new NotFoundException('Sublevel not found');
        return sub;
    }

    async update(id: string, dto: UpdateSublevelDto) {
        return this.sublevelModel.findByIdAndUpdate(id, dto, {new: true});
    }

    async remove(id: string) {
        return this.sublevelModel.findByIdAndDelete(id);
    }
}