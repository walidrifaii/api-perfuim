import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async create(book: CreateBookDto): Promise<Book> {
    const created = this.bookRepository.create(book);
    return this.bookRepository.save(created);
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    return book;
  }

  async updateById(id: string, book: UpdateBookDto): Promise<Book> {
    const existing = await this.findById(id);
    const merged = this.bookRepository.merge(existing, book);
    return this.bookRepository.save(merged);
  }

  async deleteById(id: string): Promise<Book> {
    const existing = await this.findById(id);
    await this.bookRepository.delete(id);
    return existing;
  }
}
