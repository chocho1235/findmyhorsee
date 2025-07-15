import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

interface Horse {
  id: number;
  title: string;
  breed: string;
  color: string;
  age: string;
  gender: string;
  height: string;
  price: number;
  location: string;
  platform: string;
  image: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  horses: Horse[] = [];
  loading = true;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.setSEOTags();
    this.fetchHorses();
  }

  ngOnDestroy() {
    // Angular will automatically handle cleanup
  }



  private setSEOTags() {
    this.titleService.setTitle('FindMyHorse - Buy & Sell Horses Online | Global Horse Marketplace');
    
    this.metaService.updateTag({
      name: 'description',
      content: 'Find your perfect horse on FindMyHorse - the world\'s first unified equestrian marketplace. Connect to global horse platforms and discover horses worldwide.'
    });
    
    this.metaService.updateTag({
      name: 'keywords',
      content: 'horses for sale, buy horses, sell horses, equestrian marketplace, horse breeds, competition horses, global horses, horse classifieds, equestrian, riding horses'
    });
    
    this.metaService.updateTag({
      name: 'author',
      content: 'FindMyHorse'
    });
  }

  private fetchHorses() {
    // Mock data for demonstration - static frontend only
    const mockHorses: Horse[] = [
      {
        id: 1,
        title: "Elite Dressage Champion",
        breed: "Hanoverian",
        color: "Dark Bay",
        age: "9 Years",
        gender: "Gelding",
        height: "16.3 HH",
        price: 95000,
        location: "Germany",
        platform: "Premium European Dealers",
        image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 2,
        title: "Olympic Prospect",
        breed: "Dutch Warmblood",
        color: "Bay",
        age: "7 Years",
        gender: "Mare",
        height: "16.1 HH",
        price: 125000,
        location: "Netherlands",
        platform: "International Sport Horses",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 3,
        title: "Racing Thoroughbred",
        breed: "Thoroughbred",
        color: "Chestnut",
        age: "3 Years",
        gender: "Colt",
        height: "16.0 HH",
        price: 75000,
        location: "Kentucky, USA",
        platform: "Keeneland Sales",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 4,
        title: "Show Jumping Star",
        breed: "Warmblood",
        color: "Grey",
        age: "6 Years",
        gender: "Gelding",
        height: "16.2 HH",
        price: 85000,
        location: "Belgium",
        platform: "Elite Sport Horses",
        image: "https://images.unsplash.com/photo-1594736797933-d0b22a5d8a00?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 5,
        title: "Gentle Trail Horse",
        breed: "Quarter Horse",
        color: "Palomino",
        age: "10 Years",
        gender: "Mare",
        height: "15.1 HH",
        price: 12000,
        location: "Texas, USA",
        platform: "Local Classifieds",
        image: "https://images.unsplash.com/photo-1553284965-b6d0831bd85a?w=400&h=300&fit=crop&crop=center"
      },
      {
        id: 6,
        title: "Eventing Prospect",
        breed: "Irish Sport Horse",
        color: "Chestnut",
        age: "5 Years",
        gender: "Gelding",
        height: "16.0 HH",
        price: 45000,
        location: "Ireland",
        platform: "Celtic Horses",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop&crop=center"
      }
    ];
    
    // Simulate quick loading for better UX
    setTimeout(() => {
      this.horses = mockHorses;
      this.loading = false;
    }, 500);
  }

  handleSearch(event: Event) {
    event.preventDefault();
    // This would redirect to your Angular/Node search engine
    console.log('Search functionality would redirect to your Angular/Node search engine');
    alert('This would redirect to your existing Angular search engine!');
  }



  trackByHorseId(index: number, horse: Horse): number {
    return horse.id;
  }
}
