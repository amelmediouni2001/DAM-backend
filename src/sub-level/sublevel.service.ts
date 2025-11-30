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

    async findAll() {
        return this.sublevelModel.find().populate('levelId').exec();
    }

    async findByLevel(levelId: string){
        return this.sublevelModel
        .find({levelId})
        .sort({index: 1})
        .exec();
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