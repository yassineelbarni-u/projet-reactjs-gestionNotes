import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post(':userId')
  create(@Param('userId') userId: number, @Body() noteData) {
    return this.notesService.create(noteData, userId);
  }

  @Get()
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData) {
    return this.notesService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.notesService.delete(id);
  }
}
