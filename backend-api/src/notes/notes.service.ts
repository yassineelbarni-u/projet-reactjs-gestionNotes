import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { User } from '../user/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepo: Repository<Note>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(noteData: Partial<Note>, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
  
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
  
    const note = this.noteRepo.create({
      ...noteData,
      user, // ici on est sûr que ce n’est plus null
    });
  
    return this.noteRepo.save(note);
  }

  findAll() {
    return this.noteRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.noteRepo.findOne({ where: { id }, relations: ['user'] });
  }

  update(id: number, updateData: Partial<Note>) {
    return this.noteRepo.update(id, updateData);
  }

  delete(id: number) {
    return this.noteRepo.delete(id);
  }
}
